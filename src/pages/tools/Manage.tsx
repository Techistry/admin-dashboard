import { IoNotifications } from "react-icons/io5";
import Navbar from "../../components/Navbar";
import Pages from "../../container/Pages";
import Create_Tool from "../../modals/tools/Create_Tool";
import {
  Box,
  InputAdornment,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FiSearch } from "react-icons/fi";
import { useEffect, useMemo, useState } from "react";
import Actions from "../../components/tools/Actions";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import ImportTools from "../../modals/tools/ImportTools";
import DynamicTitle from "../../utils/DynamicTitle";

interface ToolState {
  _id: string;
  name: string;
  description: string;
  category_id: Category;
  image: string;
  demo_url: string;
}

interface Category {
  _id: string;
  name: string;
}

const Manage = () => {
  const navigate = useNavigate();

  const [tools, setTools] = useState<ToolState[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [page, setPage] = useState<number>(0); // 0-indexed for MUI
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);
  const [totalCount, setTotalCount] = useState<number>(0);

  const getTools = async () => {
    setLoading(true);
    try {
      const response = await api.get(
        `/api/tool/all?limit=${rowsPerPage}&skip=${page * rowsPerPage}`
      );
      if (response.data.success) {
        setTools(response.data.data);
        setTotalCount(response.data.total); // From backend
      }
    } catch (error: any) {
      console.error("Failed to fetch tools:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTools();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    return tools.filter((tool) =>
      `${tool.name} ${tool.category_id.name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, tools]);

  return (
    <Pages>
      <DynamicTitle title="Encore AI - Tools" />

      <Navbar page="Tool Management">
        <div className="flex gap-[1rem] items-center">
          <IoNotifications color="#777777" size={20} />
          <Create_Tool refreshTools={getTools} />
        </div>
      </Navbar>

      <div className="px-[33.5px]">
        <div className="flex justify-between py-[1rem]">
          <TextField
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search A.I tools"
            size="small"
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
            }}
          />
          <ImportTools refreshTools={getTools} />
        </div>

        <div className="border-t-[1px] border-[#E5E5E6] ">
          <div className="flex justify-end">
            <TablePagination
              rowsPerPageOptions={[5, 10]}
              component="div"
              count={searchQuery ? filteredTools.length : totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>

          <Table sx={{ minWidth: 650 }} aria-label="tools table" size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#F0F2F5", height: "45px" }}>
                <TableCell>
                  <Typography fontWeight={500} fontSize={12} color="#2B2B33">
                    Tool Name
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography fontWeight={500} fontSize={12} color="#2B2B33">
                    Description
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography fontWeight={500} fontSize={12} color="#2B2B33">
                    Category
                  </Typography>
                </TableCell>
                <TableCell align="left">
                  <Typography fontWeight={500} fontSize={12} color="#2B2B33">
                    Demo Link
                  </Typography>
                </TableCell>
                <TableCell align="left" />
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 5 }).map((__, idx) => (
                      <TableCell key={idx}>
                        <Skeleton variant="text" width="100%" height={30} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredTools.length > 0 ? (
                filteredTools.map((row) => (
                  <TableRow
                    key={row._id}
                    sx={{
                      cursor: "pointer",
                      height: "50px",
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell
                      onClick={() => navigate(`/tool/view/${row._id}`)}
                    >
                      <div className="flex gap-[12px] items-center">
                        <img
                          src={row.image}
                          alt={`Logo for ${row.name}`}
                          height={25}
                          width={25}
                        />
                        <Typography
                          color="#808084"
                          fontWeight={400}
                          fontSize={14}
                          sx={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {row.name}
                        </Typography>
                      </div>
                    </TableCell>

                    <TableCell
                      align="left"
                      onClick={() => navigate(`/tool/view/${row._id}`)}
                      sx={{
                        maxWidth: 300,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Typography
                        color="#808084"
                        fontWeight={400}
                        fontSize={14}
                        sx={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        {row.description}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="left"
                      onClick={() => navigate(`/tool/view/${row._id}`)}
                    >
                      <Typography
                        color="#808084"
                        fontWeight={400}
                        fontSize={14}
                        sx={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        {row.category_id.name}
                      </Typography>
                    </TableCell>

                    <TableCell align="left">
                      <div className="bg-[#F0EEFF] rounded-[72px] py-[8px] px-[12px] w-[130px] overflow-hidden whitespace-nowrap text-ellipsis">
                        <a target="_blank" href={row.demo_url}>
                          <Typography
                            color="#755AE2"
                            fontWeight={400}
                            fontSize={14}
                            sx={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {row.demo_url}
                          </Typography>
                        </a>
                      </div>
                    </TableCell>

                    <TableCell align="left">
                      <Actions toolDetails={row} refreshTools={getTools} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box textAlign="center" py={4}>
                      <Typography variant="body1" color="textSecondary">
                        {searchQuery
                          ? "No matching tools found."
                          : "No tools found. Please create a new tool."}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Pages>
  );
};

export default Manage;
