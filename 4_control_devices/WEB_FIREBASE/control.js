// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  databaseURL: "https://your-project-id.firebaseio.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = firebase.database();

//-----------------------------------------------------------------------------------
//Firebase->Web (LED1/LED2 use BUTTON)
database.ref("/LEDControl/LED1").on("value", function(snapshot) {
    let state = snapshot.val();
    updateLightState("light1", state);
});

database.ref("/LEDControl/LED2").on("value", function(snapshot) {
    let state = snapshot.val();
    updateLightState("light2", state);
});
//Web Update (LED1/LED2 use BUTTON)
function updateLightState(lightId, state) {
    let card = document.getElementById(lightId);
    let icon = card.querySelector(".icon");
    let iconFrame = card.querySelector(".iconFrame");

    if (state === 1) {
        card.classList.add("active");
        iconFrame.classList.add("active");
        icon.style.color = "yellow"; //ON
    } else {
        card.classList.remove("active");
        iconFrame.classList.remove("active");
        icon.style.color = "#6a1b9a"; //OFF
    }
}
//------------------------------------------------------------------------------------

//Web Update->Firebase ON-------------------------------------------------------------
function turnOn(lightId) {
    database.ref("/LEDControl/" + lightId.replace("light", "LED")).set(1);
    let card = document.getElementById(lightId);
    let icon = card.querySelector(".icon");
    let iconFrame = card.querySelector(".iconFrame");

    card.classList.add("active");
    iconFrame.classList.add("active");
    icon.style.color = "yellow";
}
//Web Update->Firebase OFF-------------------------------------------------------------------
function turnOff(lightId) {
    database.ref("/LEDControl/" + lightId.replace("light", "LED")).set(0);
    let card = document.getElementById(lightId);
    let icon = card.querySelector(".icon");
    let iconFrame = card.querySelector(".iconFrame");

    card.classList.remove("active");
    iconFrame.classList.remove("active");
    icon.style.color = "#6a1b9a"; 
}
//--------------------------------------------------------------------------------------------------


//-------------------------(LED3 use TONGGLE)-----------------------------------------------------
//Web->Firebase Update
function updateLED3(state) {
    database.ref("/LEDControl/LED3").set(state)
        .then(() => console.log(`Đã cập nhật LED3 = ${state}`))
        .catch(error => console.error("Lỗi cập nhật LED3:", error));
}
// Xử lý khi người dùng nhấn công tắc
document.getElementById("toggle3").addEventListener("change", function () {
    updateLED3(this.checked ? 1 : 0);
});
//Firebase-> Web Update
database.ref("/LEDControl/LED3").on("value", function(snapshot) {
    let state = snapshot.val(); // Lấy giá trị từ Firebase
    document.getElementById("toggle3").checked = (state === 1); // Cập nhật checkbox
});
//--------------------------------------------------------------------------------------------------

//------------------------(LED4 use TONGGLE)------------------------------------------------------------------------------
//Web->Firebase Update
function updateLED4(state) {
    database.ref("/LEDControl/LED4").set(state)
        .then(() => console.log(`Đã cập nhật LED4 = ${state}`))
        .catch(error => console.error("Lỗi cập nhật LED4:", error));
}
//Xử lý khi người dùng nhấn công tắc
document.getElementById("toggle4").addEventListener("change", function () {
    updateLED4(this.checked ? 1 : 0);
});
//Firebase-> Web Update
database.ref("/LEDControl/LED4").on("value", function(snapshot) {
    let state = snapshot.val(); // Lấy giá trị từ Firebase
    document.getElementById("toggle4").checked = (state === 1); // Cập nhật checkbox
});
//----------------------------------------------------------------------------------------------

//Get data from Firebase->Web------------------------------------------------------------
database.ref("/SensorData/Temperature").on("value", function(snapshot) {
    let temp = snapshot.val();
    let tempElement = document.getElementById("temp");

    tempElement.textContent = temp;

    //Change color depend on Temp
    if (temp < 22) {
        tempElement.style.color = "blue";
    } else if (temp < 30) {
        tempElement.style.color = "green";
    } else {
        tempElement.style.color = "red";
    }
});
//-------------------------------------------------------------------------------------
database.ref("/SensorData/Humidity").on("value", function(snapshot) {
    let humidity = snapshot.val();
    let humidityElement = document.getElementById("humidity");

    humidityElement.textContent = humidity;
})
//-------------------------------------------------------------------------------------