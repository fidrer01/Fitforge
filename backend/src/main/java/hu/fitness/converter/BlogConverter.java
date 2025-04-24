package hu.fitness.converter;

import hu.fitness.domain.Blog;
import hu.fitness.domain.Trainer;
import hu.fitness.dto.BlogList;
import hu.fitness.dto.BlogRead;
import hu.fitness.dto.BlogSave;

import java.util.ArrayList;
import java.util.List;

public class BlogConverter {

    public static BlogRead convertModelToRead(Blog blog){
        BlogRead blogRead = new BlogRead();
        blogRead.setId(blog.getId());
        blogRead.setBlogType(blog.getBlogType());
        blogRead.setTitle(blog.getTitle());
        blogRead.setHeaderText(blog.getHeaderText());
        blogRead.setMainText(blog.getMainText());
        blogRead.setTrainer(TrainerConverter.convetModelToMinimal(blog.getTrainer()));
        return blogRead;
    }

    public static Blog convertSaveToModel(BlogSave blogSave, Trainer trainer){
        Blog blog = new Blog();
        blog.setBlogType(blogSave.getBlogType());
        blog.setTitle(blogSave.getTitle());
        blog.setHeaderText(blogSave.getHeaderText());
        blog.setMainText(blogSave.getMainText());
        blog.setTrainer(trainer);
        return blog;
    }

    public static List<BlogList> convertModelsToList(List<Blog> blogs){
        List<BlogList> blogLists = new ArrayList<>();
        for (Blog blog : blogs){
            blogLists.add(new BlogList(blog.getId(),blog.getTitle(),blog.getHeaderText(),blog.getMainText(),blog.getBlogType(),TrainerConverter.convetModelToMinimal(blog.getTrainer())));
        }
        return blogLists;
    }
}
