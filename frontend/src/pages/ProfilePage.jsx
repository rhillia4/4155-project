import { Box, Typography, Avatar, useTheme, Divider } from "@mui/material";
import { useAuth } from "../context/AuthContext";
 
function ProfilePage() {
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
 
  const cardStyle = {
    borderRadius: 3,
    p: 4,
    background: isDark
      ? `linear-gradient(145deg, ${theme.palette.background.paper}, #221C17)`
      : "linear-gradient(145deg, #ffffff, #f8f3ee)",
    boxShadow: isDark
      ? "0 8px 20px rgba(0, 0, 0, 0.3)"
      : "0 8px 20px rgba(111, 90, 69, 0.08)",
    border: isDark
      ? "1px solid rgba(168, 134, 94, 0.14)"
      : "1px solid rgba(111, 90, 69, 0.12)",
  };
 
  const fieldStyle = {
    py: 1.5,
    display: "flex",
    flexDirection: "column",
    gap: 0.25,
  };
 
  const dividerColor = isDark
    ? "rgba(168, 134, 94, 0.14)"
    : "rgba(111, 90, 69, 0.1)";
 
  const firstName = user?.first_name || "";
  const lastName = user?.last_name || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || user?.username || "User";
  const displayInitial = fullName.charAt(0).toUpperCase();
 
  const fields = [
    { label: "Full Name", value: fullName },
    { label: "Username", value: user?.username || "—" },
    { label: "Email", value: user?.email || "—" },
  ];
 
  return (
    <Box sx={{ p: 4, maxWidth: 560, mx: "auto" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ color: theme.palette.text.primary, mb: 4 }}
      >
        Profile
      </Typography>
 
      <Box sx={cardStyle}>
        {/* Avatar + name header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 80,
              height: 80,
              backgroundColor: isDark
                ? "rgba(168, 134, 94, 0.18)"
                : "rgba(111, 90, 69, 0.16)",
              color: theme.palette.primary.main,
              fontWeight: 700,
              fontSize: "2rem",
              border: isDark
                ? "2px solid rgba(168, 134, 94, 0.3)"
                : "2px solid rgba(111, 90, 69, 0.2)",
            }}
          >
            {displayInitial}
          </Avatar>
 
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
            >
              {fullName}
            </Typography>
            <Typography
              sx={{ color: theme.palette.text.secondary, fontSize: "0.9rem" }}
            >
              @{user?.username}
            </Typography>
          </Box>
        </Box>
 
        <Divider sx={{ borderColor: dividerColor, mb: 1 }} />
 
        {/* Fields */}
        {fields.map((field, index) => (
          <Box key={field.label}>
            <Box sx={fieldStyle}>
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: theme.palette.text.secondary,
                  opacity: 0.8,
                }}
              >
                {field.label}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: theme.palette.text.primary,
                }}
              >
                {field.value}
              </Typography>
            </Box>
            {index < fields.length - 1 && (
              <Divider sx={{ borderColor: dividerColor }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
 
export default ProfilePage;