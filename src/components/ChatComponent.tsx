"use client";

import LoadingDots from "@/src/components/LoadingDot";
import { useChatAdmin, useChatLlm, useChatStudent } from "@/src/services/hooks/hookChat";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CircularProgress,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";

const MotionBox = motion(Box);

interface Message {
  text: string;
  sender: "user" | "bot";
}

export default function ChatComponent() {

  const [model, setModel] = React.useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setModel(event.target.value as string);
  };
  
  
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      text:
        "Xin chào, tôi là trợ lý ảo của trường Đại học Văn Lang. Tôi có thể giúp gì cho bạn?",
      sender: "bot",
    },
  ]);

  const { postChatStudent } = useChatStudent();
  const { postChatAdmin } = useChatAdmin();
  const { postChatLlm } = useChatLlm();

  const handleSend = async () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;

    setChatMessages((prev) => [...prev, { text: trimmed, sender: "user" }]);
    setInputText("");
    setLoading(true);

    try {
      let res;
      const token = Cookies.get("access_token");
      if (token) {
        if (model === 'rag') {
          res = await postChatStudent({ question: trimmed });
        } else {
          res = await postChatLlm({ question: trimmed });
        }
      } else {
        if (model === 'rag') {
          res = await postChatAdmin({ question: trimmed });
        } else {
          res = await postChatLlm({ question: trimmed });
        }
      }

      setChatMessages((prev) => [
        ...prev,
        { text: res.data.answer, sender: "bot" },
      ]);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      setChatMessages((prev) => [
        ...prev,
        { text: "Lỗi khi gửi tin nhắn.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    console.log(model)
  }, [chatMessages,model]);

  return (
    <Box sx={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <Container
        maxWidth="xl"
        sx={{
          pt: "80px",
          pb: "100px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            width: { xs: "90vw", sm: 500, md: 1400 },
            minHeight: "calc(100vh - 64px - 120px)",
            bgcolor: (theme) => alpha(theme.palette.grey[600], 0.6),
            backdropFilter: "blur(10px)",
            borderRadius: 3,
            boxShadow: 3,
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
          }}
        >
          <Box sx={{ flex: 1, p: 2 }}>

            {/* them o day */}
            <Box>
              <FormControl sx={{
                width: { md:120, xs: 60 },
                position: "absolute",
                right: 20,
                overflow:{md:"visible", xs:"hidden"},
              }}>
                <InputLabel id="select-label" sx={{
                  color: "white",

                }}>Model</InputLabel>
                <Select
                  labelId="select-label"
                  id="demo-simple-select"
                  value={model}
                  label="Model"
                  onChange={handleChange}
                >
                  <MenuItem value={"rag"}>RAG</MenuItem>
                  <MenuItem value={"finetune"}>Finetune</MenuItem>

                </Select>
              </FormControl>
            </Box>

            {chatMessages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: m.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    bgcolor: m.sender === "user" ? "#C1272D" : "#C4C4C4",
                    color: m.sender === "user" ? "#fff" : "#000",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    maxWidth: "80%",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, opacity: 0.8 }}>
                    {m.sender === "user" ? "You" : "Bot"}
                  </Typography>
                  <Typography sx={{ fontSize: 14 }}>{m.text}</Typography>
                </Box>
              </Box>
            ))}

            {loading && (
              <Box sx={{ width: 80, borderRadius: 2, bgcolor: "#C4C4C4", px: 2, py: 1 }}>
                <LoadingDots />
              </Box>
            )}
            <div ref={bottomRef} />
          </Box>
        </MotionBox>
      </Container>

      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: "translateX(-50%)",
          width: { xs: "90vw", sm: 500, md: 1400 },
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 2,
          py: 1,
          bgcolor: "#fff",
          borderRadius: 2,
          backdropFilter: "blur(10px)",
          zIndex: 3,
        }}
      >
        <TextareaAutosize
          ref={inputRef}
          placeholder="Nhập câu hỏi của bạn..."
          style={{
            flex: 1,
            minHeight: 24,
            maxHeight: 96,
            borderRadius: 8,
            padding: 8,
            resize: "none",
            outline: "none",
            fontSize: 14,
            fontFamily: "inherit",
            color: "black",
          }}
          minRows={1}
          maxRows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />

        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onClick={() => !loading && handleSend()}
        >
          {loading ? (
            <CircularProgress size={20} sx={{ color: "#77777" }} />
          ) : (
            <SendIcon sx={{ color: "#77777" }} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
