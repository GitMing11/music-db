export type Genre = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  genres: Genre[];
};
