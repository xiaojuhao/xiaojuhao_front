<template>
    <div class="table">
        <header>
            <div class="title">请选择对应的仓库进行操作</div>
        </header>
        <section>
            <router-link v-for="item in mywarehouse" :to="'inventoryInPage?CODE='+item.warehouseCode">
            <el-card :body-style="{ padding: '0px' }" class="card">
              <img src="http://mpic.tiankong.com/78d/54e/78d54e55e4fde172c4ab53b39b3d9677/640.jpg" class="image">
              <div style="padding: 14px;">
                <div class="bottom clearfix">
                  <span>{{item.warehouseName}}</span>
                  <el-button type="text" class="button">入库操作</el-button>
                </div>
              </div>
            </el-card>
        </router-link>
        </section>
        <footer>
            
        </footer>
    </div>
</template>

<script>
    import {api} from '../common/bus'
	export default {
        data() {
            return {
                message:'messsage',
                mywarehouse: [],
                currentDate:'2017-11-12'
            }
        },
        mounted() {
            let $this = this;
            api.queryMyWarehouse()
            .then((list)=>{
                $this.$data.mywarehouse = list;
            })
        }
    }
</script>

<style scoped>
.title {
    width:100%;
    margin-left: 60px;
}
header,section {
    width:50%;
}
.card {
    width: 200px ;
    height: 200px;
    float:left;
    margin-left: 10px;
    margin-top: 10px;
}
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    height: 100%;
    display: inline;
  }
  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
</style>