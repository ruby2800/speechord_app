# 大學專題<SpeeChord>


結合 google speech -to-text api 和 Python SnowNLP package的react native app。此app錄音後可轉換成逐字稿並自動摘要；且加上音檔回播和文檔編輯、分享的功能。


## 我負責的內容

- record.js
開發錄音介面，設定錄音規格，且增加錄音狀況視覺化
- sound.js
開發撥放音檔介面，提供暫停、滑動進度、停止、撥放等功能，介面會與逐字稿結合，
- history.js
顯示使用者的歷史音檔，且提供上傳、改名功能，也會提示此音檔上傳與否
其中需和後端串聯，確保上傳階段(音檔已上傳、音檔已存入資料庫、逐字稿已回傳、摘要搞已回傳)有成功。
