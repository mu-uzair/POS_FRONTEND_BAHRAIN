import { data } from "react-router-dom";

export const getRandomBG = () => {
    const colors = [
        "#FF6B6B", // Soft Red
        "#FF9F43", // Vibrant Orange
        "#FDCB6E", // Warm Yellow
        "#00CEC9", // Bright Cyan
        "#6C5CE7", // Soft Purple
        "#0984E3", // Deep Blue
        "#2ED573", // Bright Green
        "#E84393", // Rose Pink
        "#FFB8B8", // Light Coral
        "#74B9FF", // Light Blue
        "#55EFC4", // Mint Green
        "#D63031", // Deep Red
        "#BADC58", // Lime Green
        "#FFEAA7", // Light Yellow
        "#A29BFE"
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};


export const  getBgColor = () => {

    const bgarr = ["#b73e3e", "#5b45b0",  "#1d2569", "#285430",]
    const randomBg = Math.floor(Math.random() * bgarr.length);
    const color = bgarr[randomBg];
    return color;
  }

export const getAvatarName = (name) =>{
    if(!name) return "";

    return name.split(" ").map(word => word[0]).join("").toUpperCase();

}


export const formatDate = (date)=>{

    const months = [
        'January', 'Fabruary','March','Apirl','May','June','July','August',
        'September','October','November','December',
    ];
    return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2,'0')}, ${date.getFullYear()}`
};

export const formatDateAndTme = (date) => {
    if (!date) {
        return "Invalid Date";
    }

    try {
        const dateAndTime = new Date(date).toLocaleString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            
            hour12: true,
            timeZone: "Asia/Karachi", // Corrected time zone
        });
        return dateAndTime;
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
    }
};


export const formatDateAndTimeNew = (date) => {
    if (!date) {
        return "Invalid Date";
    }

    try {
        const dateAndTime = new Date(date).toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Karachi",
        });

        // Replace the comma with a space
        return dateAndTime.replace(",", "    ");
    } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid Date";
    }
};