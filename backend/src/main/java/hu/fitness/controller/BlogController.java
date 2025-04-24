package hu.fitness.controller;

import hu.fitness.dto.*;
import hu.fitness.service.BlogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/blog")
@Tag(name = "Blog Functions", description = "Manage Blogs")
public class BlogController {

    @Autowired
    private BlogService blogService;

    @CrossOrigin
    @GetMapping("/")
    @Operation(summary = "List all Blogs")
    public List<BlogList> getAllBlogs(){
        return blogService.listBlogs();
    }

    @CrossOrigin
    @GetMapping("/{id}")
    @Operation(summary = "Get Blog by id")
    public BlogRead getBlogById(@PathVariable int id){
        return blogService.readBlogById(id);
    }

    @PreAuthorize("hasAuthority('CREATE_BLOG')")
    @CrossOrigin
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/")
    @Operation(summary = "Create Blog")
    public BlogRead createBlog(@Valid @RequestBody BlogSave blogSave){
        return blogService.createBlog(blogSave);
    }

    @PreAuthorize("hasAuthority('DELETE_BLOG')")
    @CrossOrigin
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete Blog by id")
    public BlogRead deleteBlog(@PathVariable int id){
        return blogService.deleteBlog(id);
    }

    @PreAuthorize("hasAuthority('UPDATE_BLOG')")
    @CrossOrigin
    @PutMapping("{id}")
    @Operation(summary = "Update Blog by id")
    public BlogRead updateBlog(@PathVariable int id, @Valid @RequestBody BlogUpdate blogUpdate){
        return blogService.updateBlog(id, blogUpdate);
    }

    @PreAuthorize("hasAuthority('UPLOAD_BLOG_IMAGE')")
    @CrossOrigin
    @PostMapping(value="/upload-image/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload Blog's Image")
    public ResponseEntity<String> uploadImage(@RequestParam("file") MultipartFile file, @PathVariable Integer id) throws IOException {
        blogService.storeImage(file, id);
        return new ResponseEntity<>("Image uploaded successfully", HttpStatus.OK);
    }

    @CrossOrigin
    @GetMapping("/image/{id}")
    @Operation(summary = "Get Blog's image by ID")
    public ResponseEntity<byte[]> getImage(@PathVariable int id) {
        return blogService.getBlogImage(id);
    }
}
