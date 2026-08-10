export interface Navbar {
  _id: string;
  logo: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NavbarResponse {
  status: boolean;
  message: string;
  data: Navbar | null;
}

export interface BaseResponse {
  status: boolean;
  message: string;
}
