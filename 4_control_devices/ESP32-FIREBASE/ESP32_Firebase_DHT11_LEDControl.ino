#include <FirebaseESP32.h>
#include <WiFi.h>
#include <DHT.h>

// Định nghĩa thông tin Wi-Fi
#define WIFI_SSID "Tr"
#define WIFI_PASSWORD "00000000"

// Định nghĩa thông tin Firebase
#define FIREBASE_HOST "https://dht11-acbe7-default-rtdb.firebaseio.com/"
#define FIREBASE_AUTH "SftGzo6EJMJqpTa8i8DphVnYxwfdugy23FuNlcRE"

// Định nghĩa cảm biến DHT
#define DHTPIN 4
#define DHTTYPE DHT11

// Định nghĩa chân LED
#define LED_PIN 2
#define LED2_PIN 13
#define LED3_PIN 12
#define LED4_PIN 14

DHT dht(DHTPIN, DHTTYPE);

// Cấu hình Firebase
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long lastTempUpdate = 0;


void setup() {
  Serial.begin(115200);
  delay(1000);

  // Kết nối Wi-Fi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Đang kết nối WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println("\nWiFi đã kết nối!");

  // Cấu hình Firebase
  config.host = FIREBASE_HOST;
  config.signer.tokens.legacy_token = FIREBASE_AUTH;

  // Khởi tạo Firebase
  Firebase.begin(&config, &auth);

  // Kiểm tra kết nối Firebase
  if (Firebase.ready()) {
    Serial.println("Firebase đã sẵn sàng!");
  } else {
    Serial.println("Firebase không kết nối được!");
  }

  // Khởi tạo cảm biến DHT
  dht.begin();

  // Cấu hình chân LED
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(LED4_PIN, OUTPUT);


  // Tắt LED ban đầu
  digitalWrite(LED_PIN, LOW); 
  digitalWrite(LED2_PIN, LOW);
  digitalWrite(LED3_PIN, LOW);  
  digitalWrite(LED4_PIN, LOW); 
}


void loop() {
  // Cập nhật nhiệt độ và độ ẩm mỗi 5 giây
  if (millis() - lastTempUpdate >= 5000) {
    lastTempUpdate = millis(); // Cập nhật thời gian

    float h = dht.readHumidity();
    float t = dht.readTemperature();
    
    if (!isnan(h) && !isnan(t)) {
      String tempStr = String(t) + " °C";
      String humStr = String(h) + " %";

      Serial.printf("Nhiệt độ: %s, Độ ẩm: %s\n", tempStr.c_str(), humStr.c_str());

      // Gửi dữ liệu lên Firebase
      FirebaseJson json;
      json.set("/Temperature", tempStr);
      json.set("/Humidity", humStr);

      if (Firebase.ready()) {
        if (Firebase.updateNode(fbdo, "/SensorData", json)) {
          Serial.println("Dữ liệu đã cập nhật lên Firebase!");
        } else {
          Serial.printf("Lỗi cập nhật Firebase: %s\n", fbdo.errorReason().c_str());
        }
      } else {
        Serial.println("Firebase chưa sẵn sàng!");
      }
    } else {
      Serial.println("Không đọc được dữ liệu từ DHT11!");
    }
  }

  // Đọc trạng thái điều khiển LED từ Firebase
  // bool ledStates[4] = {false, false, false, false};

  // if (Firebase.getBool(fbdo, "/LEDControl/LED") && fbdo.dataType() == "boolean") ledStates[0] = fbdo.boolData();
  // if (Firebase.getBool(fbdo, "/LEDControl/LED2") && fbdo.dataType() == "boolean") ledStates[1] = fbdo.boolData();
  // if (Firebase.getBool(fbdo, "/LEDControl/LED3") && fbdo.dataType() == "boolean") ledStates[2] = fbdo.boolData();
  // if (Firebase.getBool(fbdo, "/LEDControl/LED4") && fbdo.dataType() == "boolean") ledStates[3] = fbdo.boolData();

  int ledStates[4] = {0, 0, 0, 0}; // Mặc định là 0 (Tắt)

  if (Firebase.getInt(fbdo, "/LEDControl/LED1")) {
    if (fbdo.dataType() == "int") {
      ledStates[0] = fbdo.intData();
      Serial.printf("LED1 trạng thái: %d\n", ledStates[0]);
    }
  } else {
    Serial.printf("Lỗi đọc LED1: %s\n", fbdo.errorReason().c_str());
  }

  if (Firebase.getInt(fbdo, "/LEDControl/LED2")) {
    if (fbdo.dataType() == "int") {
      ledStates[1] = fbdo.intData();
      Serial.printf("LED2 trạng thái: %d\n", ledStates[1]);
    }
  } else {
    Serial.printf("Lỗi đọc LED2: %s\n", fbdo.errorReason().c_str());
  }

  if (Firebase.getInt(fbdo, "/LEDControl/LED3")) {
    if (fbdo.dataType() == "int") {
      ledStates[2] = fbdo.intData();
      Serial.printf("LED3 trạng thái: %d\n", ledStates[2]);
    }
  } else {
    Serial.printf("Lỗi đọc LED3: %s\n", fbdo.errorReason().c_str());
  }

  if (Firebase.getInt(fbdo, "/LEDControl/LED4")) {
    if (fbdo.dataType() == "int") {
      ledStates[3] = fbdo.intData();
      Serial.printf("LED4 trạng thái: %d\n", ledStates[3]);
    }
  } else {
    Serial.printf("Lỗi đọc LED4: %s\n", fbdo.errorReason().c_str());
  }


  // Cập nhật trạng thái LED
  digitalWrite(LED_PIN, ledStates[0] ? HIGH : LOW);
  digitalWrite(LED2_PIN, ledStates[1] ? HIGH : LOW);
  digitalWrite(LED3_PIN, ledStates[2] ? HIGH : LOW);
  digitalWrite(LED4_PIN, ledStates[3] ? HIGH : LOW);

  delay(100); // Giữ vòng lặp ổn định
}
