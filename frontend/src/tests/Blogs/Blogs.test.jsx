import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    // 1. teszt: Megjelenik a blogok oldal navbarral és üres üzenettel
    it('megjeleníti a blogok oldalt navbarral és az "nincs blog" üzenettel', async () => {
        renderWithProviders(<Blogs />);
        await waitFor(() => {
            expect(screen.getByText('Mockolt Navbar')).toBeInTheDocument();
            expect(screen.getByText('Jelenleg egy blog sem elérhető')).toBeInTheDocument();
        });
    });

    // 2. teszt: Blogok képekkel együtt megjelennek, ha vannak a kontextusban
    it('megjeleníti a blogokat képekkel, ha vannak a kontextusban', async () => {
        const mockBlogs = [
            {
                id: 1,
                title: 'Teszt Blog',
                blogType: 'TRAINING',
            },
        ];
        const mockImageBuffer = new ArrayBuffer(8);
        const mockBlobUrl = 'blob:http://localhost/mock-url';

        axios.get.mockResolvedValueOnce({ data: mockImageBuffer });
        global.URL.createObjectURL = jest.fn(() => mockBlobUrl);

        renderWithProviders(<Blogs />, {
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        await waitFor(() => {
            expect(screen.getByText('Teszt Blog')).toBeInTheDocument();
            expect(screen.getByText('Edzés')).toBeInTheDocument();
            expect(screen.getByAltText('Teszt Blog')).toHaveAttribute('src', mockBlobUrl);
        });

        expect(axios.get).toHaveBeenCalledWith('/blog/blog/picture/1', {
            responseType: 'arraybuffer',
            timeout: 3000,
        });
    });

    // 3. teszt: Megjelenik a "létrehozás" gomb, ha edző a felhasználó
    it('megjeleníti a létrehozás gombot, ha a userType edző', () => {
        renderWithProviders(<Blogs />, {
            userContextValue: { userType: 'TRAINER' },
        });
        const createButton = screen.getByLabelText('add');
        expect(createButton).toBeInTheDocument();
        fireEvent.click(createButton);
        expect(screen.getByText(/Blog Létrehozása/i)).toBeInTheDocument();
    });

    // 4. teszt: Nem jelenik meg a "létrehozás" gomb, ha nem edző a felhasználó
    it('elrejti a létrehozás gombot, ha a userType null', () => {
        renderWithProviders(<Blogs />);
        expect(screen.queryByLabelText('add')).not.toBeInTheDocument();
    });

    // 5. teszt: Megjelennek a szerkesztés és törlés ikonok edzőnél
    it('megjeleníti a szerkesztés és törlés ikonokat edző típusú felhasználónál', async () => {
        const mockBlogs = [
            {
                id: 1,
                title: 'Teszt Blog',
                blogType: 'TRAINING',
            },
        ];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8) });
        global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            userContextValue: { userType: 'TRAINER' },
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        await waitFor(() => {
            expect(screen.getByLabelText('edit')).toBeInTheDocument();
            expect(screen.getByLabelText('delete')).toBeInTheDocument();
        });
    });

    // 6. teszt: Nem jelennek meg a szerkesztés és törlés ikonok nem edzőnél
    it('elrejti a szerkesztés és törlés ikonokat nem edző típusú felhasználónál', async () => {
        const mockBlogs = [
            {
                id: 1,
                title: 'Teszt Blog',
                blogType: 'TRAINING',
            },
        ];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8) });
        global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        await waitFor(() => {
            expect(screen.queryByLabelText('edit')).not.toBeInTheDocument();
            expect(screen.queryByLabelText('delete')).not.toBeInTheDocument();
        });
    });

    // 7. teszt: Átnavigál a blog részleteire, ha rákattintunk a kártyára
    it('átnavigál a blog részleteire, ha rákattintunk a blog kártyára', async () => {
        const mockBlogs = [
            {
                id: 1,
                title: 'Teszt Blog',
                blogType: 'TRAINING',
            },
        ];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8) });
        global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        await waitFor(() => {
            const blogTitle = screen.getByText('Teszt Blog');
            fireEvent.click(blogTitle);
            expect(mockNavigate).toHaveBeenCalledWith('/openedBlog', {
                state: expect.objectContaining({
                    blog: mockBlogs[0],
                    blogImages: expect.any(Object),
                }),
            });
        });
    });

    // 8. teszt: Megnyitja a szerkesztő modalt, ha a szerkesztés ikonra kattintunk
    it('megnyitja a szerkesztő modalt, ha a szerkesztés ikonra kattintunk', async () => {
        const mockBlogs = [
            {
                id: 1,
                title: 'Teszt Blog',
                blogType: 'TRAINING',
            },
        ];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8) });
        global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            userContextValue: { userType: 'TRAINER' },
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        await waitFor(() => {
            const editIcon = screen.getByLabelText('edit');
            fireEvent.click(editIcon);
            expect(screen.getByText('Blog Szerkesztése Teszt Blog')).toBeInTheDocument();
        });
    });

    // 9. teszt: Megnyitja a törlés megerősítő modalt, ha a törlés ikonra kattintunk
    it('megnyitja a törlés megerősítő modalt, ha a törlés ikonra kattintunk', async () => {
        const mockBlogs = [
            {
                id: 1,
                title: 'Teszt Blog',
                blogType: 'TRAINING',
            },
        ];
        axios.get.mockResolvedValueOnce({ data: new ArrayBuffer(8) });
        global.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/mock-url');

        renderWithProviders(<Blogs />, {
            userContextValue: { userType: 'TRAINER' },
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        await waitFor(() => {
            const deleteIcon = screen.getByLabelText('delete');
            fireEvent.click(deleteIcon);
            expect(screen.getByText(/Megerősítés/i)).toBeInTheDocument();
        });
    });

    // 10. teszt: Helyettesítő képet használ, ha a kép betöltése sikertelen
    it('helyettesítő képet használ, ha a blog kép betöltése nem sikerül', async () => {
        const mockBlogs = [
            {
                id: 1,
                title: 'Teszt Blog',
                blogType: 'TRAINING',
            },
        ];
        axios.get.mockRejectedValueOnce(new Error('Kép betöltése sikertelen'));

        renderWithProviders(<Blogs />, {
            blogContextValue: { ...mockBlogContext, blogs: mockBlogs },
        });

        await waitFor(() => {
            const blogImage = screen.getByAltText('Teszt Blog');
            expect(blogImage).toHaveAttribute('src', 'https://via.placeholder.com/400x250?text=Nincs+kép');
        });
    });

    // 11. teszt: Hibaüzenetet mutat, ha a blogok betöltése nem sikerül
    it('hibaüzenetet mutat, ha a fetchBlogs nem sikerül', async () => {
        mockBlogContext.fetchBlogs.mockRejectedValueOnce(new Error('Betöltés sikertelen'));

        renderWithProviders(<Blogs />);

        await waitFor(() => {
            expect(screen.getByText('Sikertelen művelet!')).toBeInTheDocument();
        });
    });
});