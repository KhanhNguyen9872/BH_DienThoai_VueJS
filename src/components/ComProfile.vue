<template>
    <Loading v-if="!this.isLoaded"/>
    <div v-if="showPopup" class="popup-overlay">
      <div class="popup">
        <h2 class="popup-title">{{ popupMessage }}</h2>
        <div class="popup-buttons">
          <button @click="handleYes" class="btn btn-yes">Xóa</button>
          <button @click="handleNo" class="btn btn-no">Hủy</button>
        </div>
      </div>
    </div>

    <!-- Modal for changing password -->
    <div v-if="isModalOpen" class="modal">
      <div class="modal-content">
        <h2>Thay đổi mật khẩu</h2>
        <form @submit.prevent="submitNewPassword">
            <div v-if="this.resultModal.length == 0">
                <label for="old-password">Mật khẩu cũ:</label>
                <input type="password" v-model="oldPassword" id="old-password" />
            </div>
            <div v-if="this.resultModal.length == 0">
                <label for="new-password">Mật khẩu mới:</label>
                <input type="password" v-model="newPassword" id="new-password" />
            </div>
            <div v-if="this.resultModal.length == 0">
                <label for="re-new-password">Nhập lại mật khẩu:</label>
                <input type="password" v-model="reNewPassword" id="re-new-password" />
            </div>
        
          <p class="error-message" v-if="this.errorModal.length > 0">{{ this.errorModal }}</p>
          <p class="result-message" v-if="this.resultModal.length > 0" v-html="formattedResultModal"></p>
          <button v-if="this.resultModal.length == 0" type="submit" class="submit-btn">Đổi mật khẩu</button>
          <button v-if="this.resultModal.length == 0" @click="closeModal" style="margin-left: 20px;" class="cancel-btn">Hủy bỏ</button>
          <button v-if="this.resultModal.length > 0" @click="logOut" style="margin-left: 20px;" class="submit-btn">Đóng</button>
        </form>
      </div>
    </div>

    <div class="center">
        <div class="profile-container">
            <h2>Hồ sơ của bạn</h2>

            <div class="input-group">
                <label for="username">Tên đăng nhập</label>
                <input type="text" id="username" v-model="this.username" readonly>
            </div>

            <div class="password-group">
                <label for="password">Mật khẩu</label>
                <button @click="openModal" class="open-modal-btn">Đổi mật khẩu</button>
            </div>

            <div class="input-group">
                <label for="lastname">Họ của bạn</label>
                <input type="text" id="lastname" v-model="this.lastName" readonly>
            </div>

            <div class="input-group">
                <label for="firstname">Tên của bạn</label>
                <input type="text" id="firstname" v-model="this.firstName" readonly>
            </div>

            <div class="input-group">
                <label for="email">Email</label>
                <input type="text" id="email" v-model="this.email" readonly>
            </div>

            <h2 style="margin-top: 30px;">Danh sách địa chỉ</h2>
            <p class="extended-td error-message" v-if="this.information.length == 0">Chưa có địa chỉ nào! Vui lòng thêm ít nhất 1 địa chỉ để mua hàng!</p>
            <div v-else class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Họ và tên</th>
                            <th>Địa chỉ</th>
                            <th>Số điện thoại</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(info) in this.information" :key="info.id">
                            <td>{{ info.fullName }}</td>
                            <td>{{ info.address }}</td>
                            <td>{{ info.phone }}</td>
                            <td>
                                <div class="action-buttons">
                                    <button class="edit-btn" @click="editAddress(info.id)">
                                        Sửa
                                    </button>
                                    <button class="delete-btn" @click="deleteAddress(info.id)">
                                        Xóa
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <p class="error-message" v-if="this.error.length > 0">{{ this.error }}</p>
            <router-link to="/profile/address/new" v-if="this.information.length < 3" class="new-row-btn">Thêm địa chỉ</router-link>
            <p class="error-message" v-else>Không thể thêm mới địa chỉ! Tối đa 3 địa chỉ!</p>
        </div>
    </div>
</template>

<script>
import Loading from './ComLoading.vue';
import db from '@/api/db';

export default {
    name: 'ProfileInfo',
    components: {
        Loading
    },
    data() {
        return {
            userId: '',
            firstName: '',
            lastName: '',
            username: '',
            email: '',
            information: [],
            error: '',
            showPopup: false,
            selectedId: '',
            isModalOpen: false, 
            oldPassword: '',
            newPassword: '',
            reNewPassword: '',
            errorModal: '',
            resultModal: '',
            isLoaded: false,
        };
    },
    async mounted() {
        // check is logged in or not
        let user = JSON.parse(localStorage.getItem("user"));
        if (user != null) {
            const u = await db.getUser(user.username, user.password);

            user = u;
        }

        if (user == null) {
            localStorage.removeItem('user');
            this.$router.push('/login');
            return;
        }

        document.title = "Hồ sơ | KhanhStore";

        this.userId = user.id;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.email = user.email

        this.information = [];
        user.information.forEach(info => {
            this.information = [ ...this.information, info ];
        });

        await new Promise(resolve => setTimeout(resolve, 250));
        this.isLoaded = true;
    },
    computed: {
        formattedResultModal() {
            return this.resultModal.replace(/\n/g, '<br>');
        },
    },
    methods: {
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false; 
        },
        logOut() {
            localStorage.removeItem('user');
            window.location.href = '/';
        },
        async submitNewPassword() {
            if (this.oldPassword.length < 1) {
                this.errorModal = 'Vui lòng nhập mật khẩu cũ';
                return;
            }

            if (this.newPassword.length < 1) {
                this.errorModal = 'Vui lòng nhập mật khẩu mới';
                return;
            }

            if (this.reNewPassword.length < 1) {
                this.errorModal = 'Vui lòng nhập lại mật khẩu';
                return;
            }

            if (this.newPassword !== this.reNewPassword) {
                this.errorModal = 'Hai mật khẩu phải trùng nhau';
                return;
            }

            if (this.oldPassword === this.newPassword) {
                this.errorModal = 'Mật khẩu mới không được trùng với mật khẩu cũ';
                return;
            }

            const user = await db.loginUser(this.username, this.oldPassword);

            if (user == null) {
                this.errorModal = 'Mật khẩu cũ không chính xác!';
                return;
            }

            const newUser = { ...user, password: this.newPassword };
            db.updateUser(newUser);

            this.oldPassword = '';
            this.newPassword = '';
            this.reNewPassword = '';
            this.errorModal = '';
            this.resultModal = 'Đã thay đổi mật khẩu!\nVui lòng đăng nhập lại để áp dụng các thay đổi!';
        },
        openPopupDelete() {
            this.popupMessage = 'Bạn có muốn xóa địa chỉ không?';
            this.showPopup = true;
        },
        
        // Handle Yes button click
        handleYes() {
            this.popupResult = true;  // Set result to true
            this.showPopup = false;   // Hide the popup

            this.information = this.information.filter((info) => info.id !== this.selectedId);

            const newInformation = [];
            this.information.forEach((info) => {
                newInformation.push({ fullName: info.fullName, address: info.address, phone: info.phone });
            });

            db.updateAddress(this.userId, newInformation);
        },
    
        // Handle No button click
        handleNo() {
            this.popupResult = false;  // Set result to false
            this.showPopup = false;    // Hide the popup
        },
        deleteAddress(id) {
            this.selectedId = id;
            this.openPopupDelete();
        },
        editAddress(id) {
            this.$router.push({ name: 'EditAddress', query: {id: id} });
        },
    }
}
</script>

<style scoped>
.result-message {
    color: #4CAF50; /* Green color to indicate success */
    background-color: #e7f5e9; /* Light green background for better visibility */
    border: 1px solid #4CAF50; /* Green border to match the text color */
    padding: 10px; /* Some padding for better spacing */
    border-radius: 5px; /* Rounded corners */
    margin: 15px 0; /* Margin to separate from other content */
    font-size: 14px; /* Font size */
    display: flex; /* Optional: Flexbox for better alignment */
    align-items: center; /* Center vertically */
}

/* Modal background */
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

/* Modal content */
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}


body.dark-mode .modal-content {
    background-color: #686868;
}

body.dark-mode .modal-content label {
    color: #e3e3e3;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  cursor: pointer;
}

/* Button to open modal */
.open-modal-btn {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.open-modal-btn:hover {
  background-color: #0056b3;
}

/* Submit button */
.submit-btn {
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #218838;
}

/* Cancel button */
.cancel-btn {
  padding: 10px 20px;
  background-color: #FF5722;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-btn:hover {
    background-color: #E64A19;
}

input[type="password"] {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.extended-td {
  text-align: center; /* Center the content */
  font-weight: bold;
  background-color: #f9f9f9;
  padding: 20px;
  border-bottom: 2px solid #ddd;
}
/* Button styling */
.open-btn {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 30px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.3s;
}

.open-btn:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

/* Popup overlay */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Popup box */
.popup {
  background: white;
  padding: 25px 40px;
  border-radius: 12px;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: slideUp 0.4s ease-in-out;
}

body.dark-mode .popup {
    background-color: #686868;
}

@keyframes slideUp {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.popup-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

/* Button styling inside popup */
.popup-buttons {
  display: flex;
  justify-content: space-around;
}

.btn {
  padding: 12px 25px;
  font-size: 16px;
  font-weight: 500;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.btn-yes {
  background-color: #4CAF50;
  color: white;
}

.btn-yes:hover {
  background-color: #45a049;
  transform: scale(1.05);
}

.btn-no {
  background-color: #f44336;
  color: white;
}

.btn-no:hover {
  background-color: #e53935;
  transform: scale(1.05);
}

.error-message {
    color: #d9534f; /* Bootstrap's danger color */
    background-color: #f2dede; /* Light red background */
    border: 1px solid #ebccd1; /* Border color matching the background */
    padding: 10px; /* Some padding for better spacing */
    border-radius: 5px; /* Rounded corners */
    margin: 15px 0; /* Margin to separate from other content */
    font-size: 14px; /* Font size */
    display: flex; /* Optional: Flexbox for better alignment */
    align-items: center; /* Center vertically */
}

.delete-btn {
    margin-right: 20px;
    background-color: #ff4d4f;
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 60px;
    justify-content: center;
}

.delete-btn i {
    font-size: 18px; /* Icon size */
}

.delete-btn:hover {
    background-color: #ff0000;
    transform: translateY(-2px);
}

.delete-btn:focus {
    outline: none;
}

.delete-btn:active {
    background-color: #e60000;
    transform: translateY(2px);
}

.edit-btn {
    margin-right: 20px;
    background-color: #4d94ff; /* Blue color for edit */
    color: white;
    border: none;
    padding: 8px 16px;
    font-size: 14px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 60px;
    justify-content: center;
}

.edit-btn i {
    font-size: 18px; /* Icon size */
}

.edit-btn:hover {
    background-color: #0066ff; /* Darker blue on hover */
    transform: translateY(-2px);
}

.edit-btn:focus {
    outline: none;
}

.edit-btn:active {
    background-color: #005ce6; /* Slightly darker blue when active */
    transform: translateY(2px);
}

.center {
    display: flex;
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    height: 100%; /* Full height of the parent (body) */
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

body {
    background-color: #f9f9f9;
    display: flex;
    justify-content: center;
    padding: 20px;
}

.profile-container {
    width: 100%;
    max-width: 800px;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    margin: 20px 0 20px 0;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

body.dark-mode .profile-container {
    background-color: #333;
}

h2 {
    margin-bottom: 20px;
    color: #333;
    text-align: center;
}

body.dark-mode h2 {
    color: #ffffff;
}

.input-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.input-group label {
    width: 30%;
    font-weight: bold;
    color: #555;
}

.input-group input {
    width: 70%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    background-color: #f0f0f0;
    color: #555;
    cursor: not-allowed;
    margin-right: 30px;
}

body.dark-mode .input-group label {
    color: #dcdcdc;
}

.password-group {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
}

.password-group label {
    width: 30%;
    font-weight: bold;
    color: #555;
}

body.dark-mode .password-group label {
    color: #dcdcdc;
}

.password-group button {
    padding: 10px 20px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.password-group button:hover {
    background-color: #45a049;
}

/* Table styling */
.table-container {
    margin-top: 30px;
    overflow-x: auto;
}

table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
}

th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

th {
    background-color: #f2f2f2;
    font-weight: bold;
    color: #333;
}

td {
    color: #555;
}

body.dark-mode td {
    color: #dcdcdc;
}

.action-btn {
    padding: 8px 12px;
    font-size: 14px;
    border-radius: 5px;
    border: none;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s;
}

.edit-btn {
    background-color: #007bff;
    margin-right: 5px;
}

.edit-btn:hover {
    background-color: #0069d9;
}

.delete-btn {
    background-color: #d9534f;
}

.delete-btn:hover {
    background-color: #c9302c;
}

/* New row button */
.new-row-btn {
    display: inline-block;
    padding: 12px 20px;
    background-color: #28a745;
    color: white;
    font-weight: bold;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;
    transition: background-color 0.3s;
    cursor: pointer;
}

.new-row-btn:hover {
    background-color: #218838;
}
</style>
