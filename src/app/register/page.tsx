"use client";

import { useUserSignup } from "@/src/services/hooks/hookAuth";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import {
  Box,
  Container,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";


interface ValidateEmailFunction {
  (email: string): boolean;
}

const validateEmail: ValidateEmailFunction = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    role: "student",
    password: "",
  });
  const router = useRouter();
  const { postUserSignup } = useUserSignup();

    const handleCheckEmail = () => {
        if (!validateEmail(form.email)) {
          toast.warning("Vui lòng nhập email hợp lệ");
          return;
        }
      }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(form.email)) {
      toast.warning("Vui lòng nhập email hợp lệ");
      return;
    }
    try {
      await postUserSignup({
        email: form.email,
        full_name: form.full_name,
        role: form.role,
        password: form.password
      });
      toast.success("Đăng ký tài khoản thành công.");
      router.push("/login");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.detail || "Lỗi đăng ký. Vui lòng thử lại."
      );
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Paper elevation={3} sx={{ p: 4 }}>
            <Box component="form" >
              <Typography variant="h5" gutterBottom>
                Đăng ký tài khoản
              </Typography>

              <TextField
                fullWidth
                label="Họ và tên"
                name="full_name"
                margin="normal"
                required
                value={form.full_name}
                onChange={handleChange}
               
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                margin="normal"
                required
                value={form.email}
                onChange={handleChange}
                onBlur={handleCheckEmail}
              />

              <TextField
                fullWidth
                label="Mật khẩu"
                name="password"
                type="password"
                margin="normal"
                required
                value={form.password}
                onChange={handleChange}
               
              />

              <button onClick={handleSubmit} className="w-full bg-red-600 mt-4 hover:bg-red-700 text-white font-semibold py-3 rounded transition duration-300">
                Đăng ký
              </button>

              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 2,
                  color: "primary.main",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  '&:hover': { color: '#1F2251' }
                }}
                onClick={() => router.push("/user/home")}
              >
                <ArrowLeftIcon fontSize="small" sx={{ verticalAlign: "middle" }} />
                Trang chủ
              </Typography>

            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
}
