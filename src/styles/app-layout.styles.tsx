export const AppLayoutStyles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f8f8f8",
      position: "relative",
      overflow: "hidden",
    },
    logoContainer: {
      position: "fixed",
      top: 10,
      left: 10,
      zIndex: 1100,
      display: "flex",
      alignItems: "center",
      gap: 2,
    },
    content: {
      flexGrow: 1,
      pt: 8,
      pb: 4,
    },
    kitchenUtensil: (i: number) => ({
        position: "absolute" as "absolute", // הוספת סוג
        width: 40,
        height: 40,
        left: `${i * 10}px`, // ודא שהערך הוא בפורמט נכון
        top: `${i * 10}px`, // ודא שהערך הוא בפורמט נכון
        zIndex: 1,
        opacity: 0.7,
      }),
      
    kitchenUtensils: [
      "M11 5V16M18 3V10C18 12.2091 16.2091 14 14 14H11M11 16L15 20M11 16L7 20", // מזלג
      "M6 3V10", // סכין
      "M8 21H12M15 21H19M7 6.5C7 4.01472 9.01472 2 11.5 2C13.9853 2 16 4.01472 16 6.5C16 8.98528 13.9853 11 11.5 11C9.01472 11 7 8.98528 7 6.5Z", // כף
      "M19 15C19 18.866 15.866 22 12 22C8.13401 22 5 18.866 5 15C5 11.134 8.13401 8 12 8C15.866 8 19 11.134 19 15Z", // קערה
    ],
  }
  