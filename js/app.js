//可以看出自己依赖了什么-undefined可以写
(function (window,Vue,undefined) {
//假设数组

//数据 使用window.localStorage里面的数据模拟-里面的是json字符串

//在发生数据变化的时候进行监听-然后在监听中不断渲染
	new Vue({
		el:'#app',
		data:{
			showArr:[],
			hashBtn:1,
			oldinfo:{},
			abc:false,
			newTodo:'',
			list:JSON.parse(window.localStorage.getItem('list'))||[]
		},

		//当数组发生变化时,不断地将新数据存入新的localStorage
		watch:{
			list:{
				handler(newArr,oldArr){
					//要将新的存入-存入的格式为json的字符串
					// console.log(newArr)
					//必须在页面中发生改变的时候才能深度检测
					window.localStorage.setItem('list',JSON.stringify(newArr))
					this.hash()
				},
				//深度
			deep:true
			}	

		},
		//自定义焦点
		directives:{
			focus:{
				inserted(ele){
					ele.focus()
				}
			}
		},
		methods:{
			//添加数据--键盘抬起时获取数据keyup.enter事件
			//其中内容不能为空
			add(){
				if(!this.newTodo.trim()){return}//若内容为空
				this.list.push({
					content:this.newTodo.trim(),
					isFinish:false,
					id:this.list.length?this.list.sort((a,b)=>a.id-b.id)[this.list.length-1]['id']+1:1
					//箭头函数的写法-得到排序后的数组取最后的id
				})
			this.newTodo='';
			},//add 
			//删除可以直接根据索引或id
			del(index){
				console.log(index)
				this.list.splice(index,1)
			},//del
			//全删除就是将isfinish=false的拿出来冲给一个数组在渲染
			delAll(){
				this.list = this.list.filter((ele)=>ele.isFinish==false)
			},
			//双击修改--先显示框
			showEdit(index){
				this.$refs.a.forEach(ele=>{ele.classList.remove('editing')})
				this.$refs.a[index].classList.add('editing')
				this.oldinfo = JSON.parse(JSON.stringify(this.list[index]))
			},
			edit(index){
				if(!this.list[index].content.trim()) return this.list.splice(index,1) 
				if(this.list[index].content!=this.oldinfo.content) this.list[index].isFinish=false
				this.$refs.a[index].classList.remove('editing')
				this.oldinfo={}
			},
			back(index){
				this.list[index].content = this.oldinfo.content
				this.$refs.a[index].classList.remove('editing')
				this.oldinfo={}
			},
			//hash
			hash(){
				// console.log(window.location.hash)
				switch(window.location.hash){
					case '':
					case '#/':
						this.showAll()
					   this.hashBtn=1
					break
					case '#/active':
						this.activeAll(false)
					   this.hashBtn=2
					break
					case '#/completed':
						this.activeAll(true)
					   this.hashBtn=3
					break
				}
			},

			showAll(){
				this.showArr = this.list.map(()=>true)
			},
			activeAll(boo){
				this.showArr = this.list.map((ele)=>ele.isFinish==boo)
				console.log(this.showArr)
			}

		},//m
		//
		computed:{
			countNum(){
				return this.list.filter(ele=>ele.isFinish===false).length

			},
			//总按钮不好理解s
			toggle:{
				//可以对总的进行设置-如果list每一个都是true就设成true
				get(){
					return this.list.every(ele=>ele.isFinish)
				},

				set(val){
					this.list.forEach(ele=>ele.isFinish=val)
				}
			}//toggle
		},
		created(){
				this.hash()
			window.onhashchange=()=>{
				this.hash()
			}
		}
	})//vue
})(window,Vue);
