<template>
    <div class="keyboard" v-if="open">
        <!-- test keyboard -->
        <!-- <div style="width: 100%; text-align: center; margin-bottom: 3vh;">
            <input type="text" v-model="text">
        </div> -->
        <div style="displat: flex; flex: 1; width: 15%; height: auto;"></div>
        <div style="width: 70%; text-align: center;">
            <div v-if="mode === 'alphabet'">
                <div class="char_line" v-for="(line, line_index) in alphabet" :key="line_index">
                    <div v-if="line_index == 2">
                        <button style="font-size: 2.5vw;" @click="changeSymbol"> 123 </button>
                        <button class="el-icon-top" @click="changeCapital"></button>
                    </div>
                    <button v-for="(char, char_index) in line" :key="char_index" @click="addText(char)">
                        {{ char }}
                    </button>
                    <button v-if="line_index == 2" class="el-icon-back" @click="deleteText"></button>
                </div>
            </div>
            <div v-else-if="mode === 'capital'">
                <div class="char_line" v-for="(line, line_index) in capital" :key="line_index">
                    <div v-if="line_index == 2">
                        <button style="font-size: 2.5vw;" @click="changeSymbol"> 123 </button>
                        <button class="el-icon-top" @click="changeCapital"></button>
                    </div>
                    <button v-for="(char, char_index) in line" :key="char_index" @click="addText(char)">
                        {{ char }}
                    </button>
                    <button v-if="line_index == 2" class="el-icon-back" @click="deleteText"></button>
                </div>
            </div>
            <div v-else>
                <div class="char_line" v-for="(line, line_index) in symbol" :key="line_index">
                    <button v-if="line_index == 2" style="font-size: 2.5vw;" @click="changeSymbol"> 123 </button>
                    <button v-for="(char, char_index) in line" :key="char_index" @click="addText(char)"
                        :style="char == ' ' && 'width: 20vw;'">
                        {{ char }}
                    </button>
                    <button v-if="line_index == 2" class="el-icon-back" @click="deleteText"></button>
                </div>
            </div>
        </div>
        <div style="width: 15%">
            <div class="el-icon-close" style="color: #ffffff; font-size: 4vw;" @click="closeKeyboard"></div>
        </div>
    </div>
</template>

<script>
export default{
    data(){
        return{
            text: "",
            open: false,
            capsLock: false,
            mode: 'alphabet',
            alphabet: [
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
            ],
            capital: [
                ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
                ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
                ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
            ],
            symbol: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['-', '/', ':', ';', '(', ')', '$', '&', '@', '"'],
                ['.', ',', '?', ' ', '!', '\''],
            ]
        }
    },
    mounted(){
        document.onkeydown = this.keyEvents;
    },
    watch: {
        text(){
            this.$emit('getText', this.text);
        }
    },
    methods: {
        addText(c){
            this.text += c;
        },
        deleteText(){
            this.text = this.text.substring(0, this.text.length - 1);
        },
        changeSymbol(){
            if(this.mode === 'symbol')
                this.mode = 'alphabet';
            else this.mode = 'symbol';
        },
        changeCapital(){
            if(this.mode === 'capital')
                this.mode = 'alphabet';
            else this.mode = 'capital';
        },
        closeKeyboard(){
            this.open = false;
            this.$emit('closeKeyboard');
        },
        keyEvents(e){
            for(let arr of this.symbol){
                if(arr.indexOf(e.key) != -1){
                    this.text += e.key;
                    return;
                }
            }

            if(e.code == 'CapsLock' && this.mode != 'symbol'){
                this.capsLock = !this.capsLock;
                if(this.capsLock) this.mode = 'capital';
                else this.mode = 'alphabet';
            }

            if(e.shiftKey && e.code.indexOf('Key') != -1)
                this.text += e.key.toUpperCase();
            else if(this.capsLock && e.code.indexOf('Key') != -1)
                this.text += e.key.toUpperCase();
            else if(e.code == 'Backspace')
                this.text = this.text.substring(0, this.text.length - 1);
            else if(e.key >= 'a' && e.key <= 'z')
                this.text += e.key;
        }
    }
}
</script>


<style scoped>
.keyboard{
    display: flex;
    font-size: 2vw;
    margin-top: 2vw;
}

.char_line{
    display: inline-flex;
    justify-content: center;
    margin-bottom: 1.5vh;
}

.char_line > div{
    display: flex;
    flex: 1;
}

button{
    width: 6vw;
    margin: 0 0.5vw;
    font-size: 3vw;
	background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
	border-width: 0px;
	color: #ffffff;
	font-weight: bold;
	border-radius: 15px;
}
</style>