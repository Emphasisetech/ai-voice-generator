import * as URL from './index'
import axiosInstance from "../axios";
import { TeamMember } from '../../types';

export const getTeamData = async (): Promise<TeamMember[]> => {
  try {
    const res = await axiosInstance.get(URL.GET_TEAM); 
    return res.data;
  } catch (err: any) {
    console.error("Error fetching team data:", err);
    throw err;
  }
};