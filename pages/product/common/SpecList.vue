<template>
	<!-- 规格-模态层弹窗 -->
	<view class="speclist"
	>
		<!-- 遮罩层 -->
		<view class="mask"></view>
		<view class="layer attr-content" @click.stop="stopPrevent">
			<view class="a-t">
				<image src="https://gd3.alicdn.com/imgextra/i3/0/O1CN01IiyFQI1UGShoFKt1O_!!0-item_pic.jpg_400x400.jpg"></image>
				<view class="right">
					<text class="price">¥328.00</text>
					<text class="stock">库存：188件</text>
					<view class="selected">
						已选：
						<text class="selected-text">
							{{ selectsku.sp1 }}
						</text>
						<text class="selected-text">
							{{ selectsku.sp2 }}
						</text>
					</view>
				</view>
			</view>
			<view class="item-right">
				<uni-number-box 
					class="step"
					:min="1" 
					:max="stock"
					:value="quantity>stock?stock:quantity"
					:isMax="quantity>=stock?true:false"
					:isMin="quantity===1"
					:index="index"
					@eventChange="numberChange"
				></uni-number-box>
			</view>
			
			<view v-for='(item,index) in specList' :key="index" class="attr-list">
				<text>{{item.name}} </text>
				<view class="item-list">
					<text 
						v-for="(childItem, childIndex) in specChildList" 
						v-if="childItem.pid === item.id"
						:key="childIndex" class="tit"
						:class="{selected: childItem.selected}"
						@click="selectSpec(childIndex, childItem.pid)"
					>
						{{childItem.name}}
					</text>
				</view>
			</view>
		
			<button class="btn" @click="getProduct(productid)">完成</button>
		</view>
	</view>
</template>

<script>
	import uniNumberBox from '@/components/uni-number-box.vue'
	export default {
		
	    props: ['productid'],
		components: {
			uniNumberBox
		},
		data() {
			return { 
				specList:[],
				quantity:1,
				stock:10,
				index:1,
				specSelected:null,
				specList: [],
				skuList:[],
				selectsku:{},
				specChildList: []
				
			}
		},
		watch:{
			productid(nwevalue){
				console.log(nwevalue);
			}
		},
		created() {
			this.getProduct(this.productid);
		},
		methods:{
			stopPrevent(){
				
			},
			toggleSpec(){
				if(this.specClass === 'show'){
					this.specClass = 'hide';
					setTimeout(() => {
						this.specClass = 'none';
					}, 250);
				}else if(this.specClass === 'none'){
					this.specClass = 'show';
				}
			},
			numberChange(){
				
			},
			selectSpec(index, pid){
				let list = this.specChildList;
				list.forEach(item=>{
					if(item.pid === pid){
						this.$set(item, 'selected', false);
					}
				})
				this.$set(list[index], 'selected', true);
				this.getselectsku()
			},
			
			getProduct(id){
				//获取某个商品的规格,用于重选规格
				this.$request.senddata('/cart/getProduct/'+id, 'GET',{}).then(res => {
					if(res.code == 200){
						this.specList = res.data.productAttributeList;
						this.skuList = res.data.skuStockList
						let chlist = new Array()
						
						res.data.skuStockList.forEach(citem=>{
							
							let temdata1 = {pid: this.specList[0].id,name: citem.sp1}
							if(!this.ishasitem(chlist,temdata1)){
								chlist.push(temdata1)
							}
							let temdata2 = {pid: this.specList[1].id,name: citem.sp2}
							if(!this.ishasitem(chlist,temdata2)){
								chlist.push(temdata2)
							}
						})
						this.specChildList = chlist;
						
					}else{
						this.$api.msg(res.data);
					}
				}).catch(parmas => {
					uni.hideLoading()
					console.log("出错了"+JSON.stringify(parmas));
　　				})
			},
			//判断sku属性是否已添加到列表
			ishasitem(chlist,item){
				var ishave = false
				chlist.forEach(setitem=>{
					if(setitem.pid == item.pid && setitem.name == item.name){
						ishave =  true
					}
				})
				return ishave
			},
			getselectsku(){
				var sp1, sp2
				this.specChildList.forEach(item=>{
					if(item.selected){
						if(item.pid === this.specList[0].id){
							sp1 = item.name
						}else{
							sp2 = item.name
						}
					}
				})
				this.skuList.forEach(item=>{
					if(item.sp1 === sp1 && item.sp2 === sp2 )
						this.selectsku = item;
					}
				)
				
			}
		}
	}
	
</script>

<style lang='scss'>
	.speclist{
		background-color: rgba(0, 0, 0, 0.4);
		.layer {
			position: fixed;
			z-index: 99;
			bottom: 0;
			width: 100%;
			min-height: 40vh;
			border-radius: 10upx 10upx 0 0;
			background-color: #fff;
			
		}
	}


	/* 规格选择弹窗 */
	.attr-content{
		background-color: #FFFFFF;
		padding: 10upx 30upx;
		bottom: 0upx;
		width: 100%;
		position: fixed;
	
		.a-t{
			display: flex;
			image{
				width: 170upx;
				height: 170upx;
				flex-shrink: 0;
				margin-top: -40upx;
				border-radius: 18upx;
			}
			.right{
				display: flex;
				flex-direction: column;
				padding-left: 24upx;
				font-size: $font-sm + 2upx;
				color: $font-color-base;
				line-height: 42upx;
				.price{
					font-size: $font-lg;
					color: $uni-color-primary;
					margin-bottom: 10upx;
				}
				.selected-text{
					margin-right: 10upx;
				}
			}
		}
		.attr-list{
			display: flex;
			flex-direction: column;
			font-size: $font-base + 2upx;
			color: $font-color-base;
			padding-top: 30upx;
			padding-left: 10upx;
		}
		.item-list{
			padding: 20upx 0 0;
			display: flex;
			flex-wrap: wrap;
			text{
				display: flex;
				align-items: center;
				justify-content: center;
				background: #eee;
				margin-right: 20upx;
				margin-bottom: 20upx;
				border-radius: 100upx;
				min-width: 60upx;
				height: 60upx;
				padding: 0 20upx;
				font-size: $font-base;
				color: $font-color-dark;
			}
			.selected{
				background: #fbebee;
				color: $uni-color-primary;
			}
		}
		.btn{
			height: 66upx;
			line-height: 66upx;
			border-radius: 100upx;
			background: $uni-color-primary;
			font-size: $font-base + 2upx;
			color: #fff;
			margin: 30upx auto 20upx;
		}
	}
	
	.item-right{
		
		position:relative;
		padding-top: 80upx;
		.uni-numbox{
			margin-left: -30upx;
		}
	}
	

</style>
