export type typeBlog = {
    id: string;
    title: string;
    content: string;
    authorId: string;
    createdAt: string;
    author: {
      name: string;
      email: string;
    };
};