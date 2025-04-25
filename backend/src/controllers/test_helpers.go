package controllers

import "time"

func getFutureTime() time.Time {
	return time.Now().Add(time.Hour)
}
