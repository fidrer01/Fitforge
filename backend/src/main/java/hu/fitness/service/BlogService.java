package hu.fitness.service;

import hu.fitness.converter.BlogConverter;
import hu.fitness.domain.Blog;
import hu.fitness.domain.FileEntity;
import hu.fitness.domain.Trainer;
import hu.fitness.dto.*;
import hu.fitness.exception.BlogNotFoundException;
import hu.fitness.exception.PictureNotFoundException;
import hu.fitness.exception.TrainerNotFoundException;
import hu.fitness.repository.BlogRepository;
import hu.fitness.repository.FileRepository;
import hu.fitness.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.util.List;

@Service
public class BlogService {

    @Autowired
    private BlogRepository blogRepository;

    @Autowired
    private TrainerRepository trainerRepository;

    @Autowired
    private FileRepository fileRepository;

    public List<BlogList> listBlogs() {
        List<BlogList> blogList;
        List<Blog> blogs = blogRepository.findAll();
        blogList = BlogConverter.convertModelsToList(blogs);
        return blogList;
    }

    public BlogRead readBlogById(Integer id){
        if(!blogRepository.existsById(id)){
            throw new BlogNotFoundException();
        }
        Blog blog = blogRepository.getReferenceById(id);
        return BlogConverter.convertModelToRead(blog);
    }

    public BlogRead createBlog(BlogSave blogSave){
        if(!trainerRepository.existsById(blogSave.getTrainerId())){
            throw new TrainerNotFoundException();
        }
        Trainer trainer = trainerRepository.getReferenceById(blogSave.getTrainerId());
        Blog blog = BlogConverter.convertSaveToModel(blogSave, trainer);
        Blog savedBlog = blogRepository.save(blog);
        return BlogConverter.convertModelToRead(savedBlog);
    }

    public BlogRead deleteBlog(int id){
        if(!blogRepository.existsById(id)){
            throw new BlogNotFoundException();
        }

        BlogRead blogRead = BlogConverter.convertModelToRead(blogRepository.getReferenceById(id));
        blogRepository.deleteById(id);
        return blogRead;
    }

    public BlogRead updateBlog(int id, BlogUpdate blogUpdate){
        if (!blogRepository.existsById(id)) {
            throw new BlogNotFoundException();
        }

        Blog blog = blogRepository.getReferenceById(id);
        Trainer trainer = blog.getTrainer();
        blog.setBlogType(blogUpdate.getBlogType());
        blog.setTitle(blogUpdate.getTitle());
        blog.setHeaderText(blogUpdate.getHeaderText());
        blog.setMainText(blogUpdate.getMainText());
        blog.setTrainer(trainer);
        blogRepository.save(blog);
        return BlogConverter.convertModelToRead(blog);
    }

    @Transactional
    public void storeImage(MultipartFile file, Integer blogId) throws IOException {
        if (!blogRepository.existsById(blogId)) {
            throw new BlogNotFoundException();
        }

        Blog blog = blogRepository.getReferenceById(blogId);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setFileName(file.getOriginalFilename());
        fileEntity.setFileType(file.getContentType());
        fileEntity.setData(file.getBytes());

        fileEntity = fileRepository.save(fileEntity);
        blog.setFileEntity(fileEntity);
        blogRepository.save(blog);
    }

    public ResponseEntity<byte[]> getBlogImage(Integer blogId) {

        if (!blogRepository.existsById(blogId)) {
            throw new BlogNotFoundException();
        }

        Blog blog = blogRepository.getReferenceById(blogId);

        FileEntity fileEntity = blog.getFileEntity();
        if (fileEntity == null) {
            throw new PictureNotFoundException();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileEntity.getFileType()))
                .body(fileEntity.getData());
    }
}
