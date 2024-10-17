import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Route,
  Tags,
} from "tsoa";
import {
  BookInputDTO,
  BookInputPatchDTO,
  BookOutputDTO,
} from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { BookCollectionOutputDTO } from "../dto/bookCollection.dto";

import { checkPermissions } from "../middlewares/permissions";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  public async getAllBooks(): Promise<BookOutputDTO[]> {
    if(checkPermissions("book", "read")){
    return bookService.getAllBooks();
    }
    else{
      throw new Error("Forbidden: Insufficient permissions to create a book");
    }
  }

  @Get("{id}")
  public async getBook(@Path("id") id: number): Promise<BookOutputDTO> {
    if(checkPermissions("book", "read")){
    return await bookService.getBookById(id);
  }else{
    throw new Error("Forbidden: Insufficient permissions to create a book");
  }
  }

  @Post("/")
  public async postBooks(
    @Body() requestBody: BookInputDTO,
  ): Promise<BookOutputDTO> {
    if(checkPermissions("book", "write")){
      return bookService.createBook(
        requestBody.title,
        requestBody.publish_year,
        requestBody.author_id,
        requestBody.isbn,
      );
    }else{
      throw new Error("Forbidden: Insufficient permissions to create a book");
    }
  }

  
  @Patch("{id}")
  public async patchBook(
    @Path("id") id: number,
    @Body() requestBody: BookInputPatchDTO,
  ): Promise<BookOutputDTO> {
    if(checkPermissions("book", "write")){
    return bookService.updateBook(
      id,
      requestBody.title,
      requestBody.publish_year,
      requestBody.author_id,
      requestBody.isbn,
    );
    }else{
      throw new Error("Forbidden: Insufficient permissions to create a book");
    }
  }

  @Delete("{id}")
  public async deleteBook(@Path("id") id: number): Promise<void> {
    if(checkPermissions("book", "delete")){
    await bookService.deleteBook(id);
    }else{
      throw new Error("Forbidden: Insufficient permissions to create a book");
    }
  }

  @Get("{id}/book-collections")
  public async getBookCollectionsByBookId(
    @Path() id: number,
  ): Promise<BookCollectionOutputDTO[]> {
    if(checkPermissions("book", "read")){
    return bookService.getBookCollectionsByBookId(id);
  }else{
    throw new Error("Forbidden: Insufficient permissions to create a book");
  }
}
}
