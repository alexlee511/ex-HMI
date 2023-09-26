<template>
    <el-dialog
    :visible.sync="dialogVisible"
    :before-close="handleClose"
    width="50%"
    :modal="false"
    class="dialogNumLock"
    >
      <div>
        <table>
            <tr>
              <td class="result-type" colspan="4">
                <input v-bind:type="inputType" v-bind:value="input_password" readonly="true">
                <button v-on:click="deleteInput">◀️</button>
              </td>
            </tr>
            <tr v-for="(tr_val, tr_idx) in num_lock" v-bind:key="tr_idx">
                <td v-for="(td_val, td_idx) in tr_val" v-bind:key="td_idx" v-bind:colspan="td_val.colspan">
                  <input type="button" 
                    v-bind:value="td_val.value"
                    v-on:click="goAction($event, td_val.action)"
                    v-on:touchstart="goAction($event, td_val.action)"
                    v-on:touchend="goAction($event, td_val.action)"
                    :style="td_val.style">
                </td>
            </tr>
        </table>
      </div>
    </el-dialog>
</template>

<script>

import { Dialog as ElDialog, Notification} from "element-ui";

export default {
  components: {
    ElDialog,
    Notification
  },
  data() {
    return {
      input_password: '',
      inputType: 'password',
      current_password: '52883637',
      dialogVisible: false,
      goPath: '',
      num_lock:[    //產生數字欄位的內容，value=> 密碼欄位內容 、 action => 綁定的method
        [ 
          {value: '7', action: 'changeInput'},
          {value: '8', action: 'changeInput'},
          {value: '9', action: 'changeInput'},
          {value: '↩️', action: 'btnClose'},
        ],
        [ 
          {value: '4', action: 'changeInput'},
          {value: '5', action: 'changeInput'},
          {value: '6', action: 'changeInput'},
          {value: 'C', action: 'clearInput'},
        ],
        [ 
          {value: '1', action: 'changeInput'},
          {value: '2', action: 'changeInput'},
          {value: '3', action: 'changeInput'},
          {value: '👁', action: 'showPassword'},
        ],
        [ 
          {value: '.', action: 'changeInput'},
          {value: '0', action: 'changeInput'},
          {value: '✔', action: 'checkResult', colspan: '2'},
        ],
      ]
    }
  },
  methods: {
      //改變密碼框
      changeInput ($event) {
          let val = $event.target.value;
          this.input_password += val;
          if(this.input_password.length > 20){
            Notification({
                  title: this.$t('GENERAL.ERROR_MSG_009'),
                  message: this.$t('GENERAL.ERROR_MSG_010')
              });
            this.input_password = this.input_password.substr(0, this.input_password.length - 1);
          }
      },
      //清除密碼框
      clearInput (){
          this.input_password = '';
      },
      //清除密碼框
      deleteInput (){
          let original_password = this.input_password;
          this.input_password = original_password.substr(0,original_password.length -1);
      },
      //驗證密碼正確
      checkResult (){
            let val = this.input_password;
            let go_path = this.goPath;
            if(val == this.current_password){
                this.$router.push({path: go_path});
            }else{
              Notification({
                  title: this.$t('GENERAL.ERROR_MSG_007'),
                  message: this.$t('GENERAL.ERROR_MSG_008')
              });
              this.input_password = '';
            }
      },
      //顯示密碼，將密碼從米字號轉為數字
      showPassword (type){
        if(type == 'touchstart'){
            this.inputType = 'type';
        }else{
            this.inputType = 'password';
        }
      },
      //鍵盤行為的router
      goAction(e, action){
        let eventType = e.type;
        switch (eventType) {
          case 'touchstart':
          case 'touchend':
              switch (action) {
                case 'showPassword':
                  this.showPassword(e.type);
                break;
              
                default:
                  return;
                break;
              }
            break;
          case 'click':
              switch (action) {
                case 'changeInput':
                  this.changeInput (e);
                break;
                case 'clearInput':
                    this.clearInput();
                break;
                case 'checkResult':
                    this.checkResult();
                break;
                case 'deleteInput':
                    this.deleteInput();
                break;
                case 'btnClose':
                    this.btnClose();
                break;
                default:
                  return;
                break;
              }
          break;
          default:
            return;
          break;
        }
      },
      //關閉視窗前事件處理
      handleClose(done) {
        this.input_password = '';
        this.goPath = '';
        done();
      },
      //關閉視窗
      btnClose(){
        this.input_password = '';
        this.goPath = '';
        this.dialogVisible = false;
      }
  },
  mounted() {
    //動作showNumLock用以開啟密碼框，get_path取得要跳轉的目的路徑
    this.$bus.$on("showNumLock", (get_path) => {
      switch (get_path) {
        case '/programManagement':  //方案管理
        case '/gateway':            //系統設定
          this.dialogVisible = true;
          this.goPath = get_path;
          break;
        default:
          break;
      }
      
    });
  },
  beforeDestroy() {
    this.$bus.$off("showNumLock");
  },
};
</script>

<style>
.dialogNumLock{
  font-weight: bold;
  background-color: rgba(10, 38, 81, 0.8);
  width: 100%;
  border-style: solid;
  border-width: 2px;
  border-color: #0b6f94;
  white-space: nowrap;
}

.dialogNumLock .el-dialog__body{
  background-color: #061444a1;
  padding: 0px 30px 20px;
  font-size: 3.2vmin;
  font-weight: bold;
  display: flex ;
  justify-content: center ;
  align-items: center ; 
}

.dialogNumLock .el-dialog, .el-pager li{
  background-color: transparent !important;
}

.dialogNumLock .el-dialog__header{
  background: #061444a1;
}
</style>
<style scoped>
/*區域style設定 */
tr {
  width: 100%;
}

td {
  width: 23.75%;
  height: 23.75%;
}

td input {
  width: 100%;
  height: 9.5vh;
  float: right;
  background: linear-gradient(rgba(10, 137, 255, 0.8), rgba(33, 96, 184, 0.8));
  color: white;
  font-weight: bold;
}

.result-type{
  position: relative;
}

.result-type input{
  width: 100%;
  color: white;
}

.result-type button{
  position: absolute;
  top: 0%;
  left: 75%;
  border:0;
  background-color: transparent;
  font-weight: bold;
  color: white;
  height: 100%;
  width: 23.75%;
}
</style>