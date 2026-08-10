import { isAxiosError } from "axios";
import axiosInstance from "@/lib/instance/axios-instance";
import { NavbarResponse, BaseResponse } from "../types/navbar.type";

export const navbarApi = {
  getNavbar: async (): Promise<NavbarResponse> => {
    try {
      const response = await axiosInstance.get("/logo/get");
      const logoData = response.data?.data;

      return {
        ...response.data,
        data: logoData
          ? {
              _id: logoData._id,
              logo: logoData.logo?.secureUrl || logoData.logo?.url || "",
              createdAt: logoData.createdAt,
              updatedAt: logoData.updatedAt,
              __v: logoData.__v,
            }
          : null,
      };
    } catch (error) {
      if (
        isAxiosError(error) &&
        error.response?.status === 404 &&
        error.response?.data?.message === "Logo not found"
      ) {
        return {
          status: false,
          message: "Logo not found",
          data: null,
        };
      }

      throw error;
    }
  },

  createNavbar: async (data: { logo: File }): Promise<NavbarResponse> => {
    const formData = new FormData();
    formData.append("logo", data.logo);

    const response = await axiosInstance.post("/logo/create", formData);
    const logoData = response.data?.data;

    return {
      ...response.data,
      data: {
        _id: logoData._id,
        logo: logoData.logo?.secureUrl || logoData.logo?.url || "",
        createdAt: logoData.createdAt,
        updatedAt: logoData.updatedAt,
        __v: logoData.__v,
      },
    };
  },

  updateNavbar: async (
    _id: string,
    data: { logo?: File },
  ): Promise<NavbarResponse> => {
    const formData = new FormData();
    if (data.logo) {
      formData.append("logo", data.logo);
    }

    const response = await axiosInstance.patch("/logo/update", formData);
    const logoData = response.data?.data;

    return {
      ...response.data,
      data: {
        _id: logoData._id,
        logo: logoData.logo?.secureUrl || logoData.logo?.url || "",
        createdAt: logoData.createdAt,
        updatedAt: logoData.updatedAt,
        __v: logoData.__v,
      },
    };
  },

  deleteNavbar: async (_id: string): Promise<BaseResponse> => {
    const response = await axiosInstance.delete("/logo/delete");
    return response.data;
  },
};
