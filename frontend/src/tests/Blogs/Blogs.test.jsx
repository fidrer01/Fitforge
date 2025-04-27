import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import Blogs from '../../components/Blogs/Blogs';
import UserContext from '../../components/Context/User/UserContext';
import BlogContext from '../../components/Context/Blog/BlogContext';
import axios from 'axios';

jest.mock('../../components/Navbar/Navbar', () => () => <div>Mockolt Navbar</div>);
jest.mock('../../components/Blogs/CreateBlog/CreateBlog', () => ({ close }) => (
    <div>Blog Létrehozása <button onClick={close}>Bezár</button></div>
));
jest.mock('../../components/Blogs/EditBlog/EditBlog', () => ({ close, blog }) => (
    <div>Blog Szerkesztése {blog?.title} <button onClick={close}>Bezár</button></div>
));
jest.mock('../../components/Confirmation', () => ({ close, deleteFunction, deletingId }) => (
    <div>Megerősítés <button onClick={() => deleteFunction(deletingId)}>Megerősít</button></div>
));

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    BrowserRouter: ({ children }) => <div>{children}</div>,
    useNavigate: () => mockNavigate,
}));

jest.mock('axios', () => ({
    __esModule: true,
    default: {
        get: jest.fn(),
        delete: jest.fn().mockResolvedValue({}),
    },
}));

const mockBlogContext = {
    blogs: [],
    fetchBlogs: jest.fn().mockResolvedValue([]),
};

const mockUserContext = {
    userType: null,
};

const renderWithProviders = (
    ui,
    {
        userContextValue = mockUserContext,
        blogContextValue = mockBlogContext,
    } = {}
) => {
    return render(
        <UserContext.Provider value={userContextValue}>
            <BlogContext.Provider value={blogContextValue}>
                {ui}
            </BlogContext.Provider>
        </UserContext.Provider>
    );
};

describe('Blogs', () => {
    beforeEach(() => {
        mockNavigate.mockClear();
        mockBlogContext.fetchBlogs.mockClear();
        axios.get.mockClear();
        axios.delete.mockClear();
        global.URL.createObjectURL = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('megjeleníti a blogok oldalt navbarral és az "nincs blog" üzenettel', async () => {
        renderWithProviders(<Blogs />);
        expect(await screen.findByText('Mockolt Navbar')).toBeInTheDocument();
        expect(await screen.findByText('Jelenleg egy blog sem elérhető')).toBeInTheDocument();
    });

    it('megjeleníti a blogokat képekkel, ha vannak a kontextusban', async () => {
        const mockBlogs = [{
            id: 1,
            title: 'Teszt Blog',
            headerText: 'Header',
            mainText: 'Main text',
            blogType: 'TRAINING',
            trainer: { id: 1, name: 'Trainer' },
        }];
        const mockBlobUrl = 'blob:http://localhost/mock-url';
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8), headers: { 'content-type': 'image/jpeg' } });
        global.URL.createObjectURL.mockReturnValue(mockBlobUrl);

        renderWithProviders(<Blogs />, {
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        expect(await screen.findByText('Teszt Blog', {}, { timeout: 5000 })).toBeInTheDocument();
        expect(await screen.findByText('Edzés', {}, { timeout: 5000 })).toBeInTheDocument();
        expect(await screen.findByAltText('Teszt Blog', {}, { timeout: 5000 })).toHaveAttribute('src', mockBlobUrl);
    });

    it('megjeleníti a létrehozás gombot, ha a userType edző', async () => {
        renderWithProviders(<Blogs />, { userContextValue: { userType: 'TRAINER' } });
        const createButton = await screen.findByRole('button', { name: /add/i });
        expect(createButton).toBeInTheDocument();
        fireEvent.click(createButton);
        expect(await screen.findByText(/Blog Létrehozása/i)).toBeInTheDocument();
    });

    it('elrejti a létrehozás gombot, ha a userType null', () => {
        renderWithProviders(<Blogs />);
        expect(screen.queryByLabelText('add')).not.toBeInTheDocument();
    });

    it('megjeleníti a szerkesztés és törlés ikonokat edző típusú felhasználónál', async () => {
        const mockBlogs = [{
            id: 1,
            title: 'Teszt Blog',
            headerText: 'Header',
            mainText: 'Main text',
            blogType: 'TRAINING',
            trainer: { id: 1, name: 'Trainer' },
        }];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8), headers: { 'content-type': 'image/jpeg' } });
        global.URL.createObjectURL.mockReturnValue('blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            userContextValue: { userType: 'TRAINER' },
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        const blogTitle = await screen.findByText('Teszt Blog', {}, { timeout: 5000 });
        const blogCard = blogTitle.closest('.MuiCard-root');
        const icons = within(blogCard).getAllByRole('img');

        expect(icons).toHaveLength(2);
    });

    it('elrejti a szerkesztés és törlés ikonokat nem edző típusú felhasználónál', async () => {
        const mockBlogs = [{
            id: 1,
            title: 'Teszt Blog',
            headerText: 'Header',
            mainText: 'Main text',
            blogType: 'TRAINING',
            trainer: { id: 1, name: 'Trainer' },
        }];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8), headers: { 'content-type': 'image/jpeg' } });
        global.URL.createObjectURL.mockReturnValue('blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            userContextValue: { userType: null },
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        const blogTitle = await screen.findByText('Teszt Blog', {}, { timeout: 5000 });
        const blogCard = blogTitle.closest('.MuiCard-root');
        const icons = within(blogCard).queryAllByRole('img');

        expect(icons).toHaveLength(0);
    });

    it('megnyitja a szerkesztő modalt, ha a szerkesztés ikonra kattintunk', async () => {
        const mockBlogs = [{
            id: 1,
            title: 'Teszt Blog',
            headerText: 'Header',
            mainText: 'Main text',
            blogType: 'TRAINING',
            trainer: { id: 1, name: 'Trainer' },
        }];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8), headers: { 'content-type': 'image/jpeg' } });
        global.URL.createObjectURL.mockReturnValue('blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            userContextValue: { userType: 'TRAINER' },
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        const blogTitle = await screen.findByText('Teszt Blog', {}, { timeout: 5000 });
        const blogCard = blogTitle.closest('.MuiCard-root');
        const icons = within(blogCard).getAllByRole('img');
        const editIcon = icons[0];

        fireEvent.click(editIcon);
        expect(await screen.findByText('Blog Módosítása', {}, { timeout: 5000 })).toBeInTheDocument();
    });

    it('megnyitja a törlés megerősítő modalt, ha a törlés ikonra kattintunk', async () => {
        const mockBlogs = [{
            id: 1,
            title: 'Teszt Blog',
            headerText: 'Header',
            mainText: 'Main text',
            blogType: 'TRAINING',
            trainer: { id: 1, name: 'Trainer' },
        }];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8), headers: { 'content-type': 'image/jpeg' } });
        global.URL.createObjectURL.mockReturnValue('blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            userContextValue: { userType: 'TRAINER' },
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        const blogTitle = await screen.findByText('Teszt Blog', {}, { timeout: 5000 });
        const blogCard = blogTitle.closest('.MuiCard-root');
        const icons = within(blogCard).getAllByRole('img');
        const deleteIcon = icons[1];

        fireEvent.click(deleteIcon);
        expect(await screen.findByText(/Biztos ki akarod törölni/i, {}, { timeout: 5000 })).toBeInTheDocument();
    });

    it('helyettesítő képet használ, ha a blog kép betöltése nem sikerül', async () => {
        const mockBlogs = [{
            id: 1,
            title: 'Teszt Blog',
            headerText: 'Header',
            mainText: 'Main text',
            blogType: 'TRAINING',
            trainer: { id: 1, name: 'Trainer' },
        }];
        axios.get.mockRejectedValueOnce(new Error('Kép betöltése sikertelen'));

        renderWithProviders(<Blogs />, {
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        expect(await screen.findByAltText('Teszt Blog', {}, { timeout: 5000 })).toHaveAttribute('src', '');
    });

    it('hibaüzenetet mutat, ha a fetchBlogs nem sikerül', async () => {
        mockBlogContext.fetchBlogs.mockRejectedValueOnce(new Error('Betöltés sikertelen'));
        renderWithProviders(<Blogs />);
        expect(await screen.findByText('Sikertelen művelet!')).toBeInTheDocument();
    });
});