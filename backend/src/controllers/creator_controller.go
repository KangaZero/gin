package controllers

import (
    "net/http"
    "github.com/gin-gonic/gin"
)

func GetAllSocials(c *gin.Context) {
    socials := []map[string]string{
        {
            "Facebook": "https://www.facebook.com",
        },
        {
            "Github":   "https://github.com/KangaZero",
            "username": "KangaZero",
        },
        {
            "Twitter": "",
        },
        {
            "Youtube": "",
        },
		{
			"license": "https://github.com/KangaZero/gin/blob/main/LICENSE",
		},
    }

    c.JSON(http.StatusOK, gin.H{
        "count": len(socials),
        "data":  socials,
    })
}