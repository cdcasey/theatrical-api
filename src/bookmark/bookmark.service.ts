import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  getBookmarks(userId: string) {}

  getBookmarkById(userId: string, bookmarkId: string) {}

  createBookmark(userId: string, dto: CreateBookmarkDto) {}

  editBookmarkById(userId: string, bookmarkId: string, dto: EditBookmarkDto) {}

  deleteBookmarkById(userId: string, bookmarkId: string) {}
}
