//link firebase
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
  };

// Khởi tạo Firebase
firebase.initializeApp(firebaseConfig);

// Kết nối Realtime Database
const database = firebase.database();

function updateCircle(temp) {
    const maxTemp = 100; // Giả sử nhiệt độ tối đa là 100°C
    const percentage = (temp / maxTemp) * 314; // Tính phần trăm chu vi

    // Kiểm tra giá trị nhiệt độ hợp lệ
    if (temp === null || isNaN(temp)) {
        console.warn("Dữ liệu nhiệt độ không hợp lệ!");
        return;
    }

    // Cập nhật vòng tròn
    document.getElementById('circleProgress').style.strokeDashoffset = 314 - percentage;

    // Không cập nhật tempLabel vì đã có icon mặt trời
}

// Đảm bảo Firebase đã được khởi tạo trước khi gọi database
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// Lấy dữ liệu từ Firebase
const tempRef = firebase.database().ref('IoT_Lab/Temp');
tempRef.on('value', (snapshot) => {
    const temperature = snapshot.val();
    updateCircle(temperature);
});
//---------------------------------------------------------------------------------
function updateCircleHumidity(humidity) {
    const maxHumidity = 100; // Độ ẩm tối đa là 100%
    const percentage = (humidity / maxHumidity) * 314; // Tính phần trăm chu vi

    // Kiểm tra giá trị độ ẩm hợp lệ
    if (humidity === null || isNaN(humidity)) {
        console.warn("Dữ liệu độ ẩm không hợp lệ!");
        return;
    }

    // Cập nhật vòng tròn độ ẩm
    document.getElementById('circleHumidity').style.strokeDashoffset = 314 - percentage;
}

// Kiểm tra Firebase đã khởi tạo chưa
if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

// Lấy dữ liệu từ Firebase cho độ ẩm
const humdRef = firebase.database().ref('IoT_Lab/Humd');
humdRef.on('value', (snapshot) => {
    const humidity = snapshot.val();
    console.log("Dữ liệu độ ẩm từ Firebase:", humidity); // Debug dữ liệu từ Firebase
    updateCircleHumidity(humidity);
});

