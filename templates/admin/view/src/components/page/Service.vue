<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> service list
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
             <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd">create</el-button>
            </div>
            <el-table
                v-loading="loading"
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="name" label="schema name" width="150"></el-table-column>
                <el-table-column prop="mtime" label="mtime" width="150">
                    <template slot-scope="scope">
                        <div>{{ scope.row.mtime|dateFilter }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="size" width="50"></el-table-column>
                 <el-table-column prop="description" label="description" ></el-table-column>
                
                <el-table-column label="operation" width="500" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >edit</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >delete</el-button>
                        <el-button 
                            type="text"
                            icon="el-icon-lx-edit"
                            class="black"
                            @click="handleGenerate(scope.$index, scope.row)"
                        >{{scope.row.client?'re-generate':'generate'}}</el-button>
                         <el-button v-if="scope.row.client"
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleRemove(scope.$index, scope.row)"
                        >remove-client</el-button>
                        <el-dropdown v-if="scope.row.client" @command="handleTenant">
                            <el-button v-if="scope.row.client"
                                type="text"
                                icon="el-icon-lx-cascades"
                                class="blue"
                            >tenants</el-button>
                             <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="scope.row" id="list">list</el-dropdown-item>
                                <el-dropdown-item  :command="scope.row" id="add">add</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        <el-dropdown v-if="scope.row.client" @command="handleRouter">
                            <el-button 
                                type="text"
                                icon="el-icon-link"
                                class="blue"
                            >router</el-button>
                             <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :command="scope.row" id="up">up</el-dropdown-item>
                                <el-dropdown-item  v-if="scope.row.router" :command="scope.row" id="down">down</el-dropdown-item>
                                <el-dropdown-item  v-if="scope.row.router" :command="scope.row" id="graphql">graphql-ui</el-dropdown-item>
                                <el-dropdown-item  v-if="scope.row.router" :command="scope.row" id="swagger">swagger</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </template>
                </el-table-column>
            </el-table>
           
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="addFlag?'create new':'edit'" :visible.sync="editVisible" width="70%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                <el-form-item label="schema name" prop="name">
                    <el-input placeholder="end with .prisma" v-model="form.name" :readOnly="!addFlag"></el-input>
                </el-form-item>
                <el-form-item label="description" prop="description">
                    <el-input placeholder="input description" v-model="form.description" ></el-input>
                </el-form-item>
                <el-form-item label="content" prop="content">
                    <el-input type="textarea" :rows="20" v-model="form.content"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">cancel</el-button>
                <el-button type="primary" @click="saveEdit">submit</el-button>
            </span>
        </el-dialog>
        <Router ref="router" @routerUpdate="routerUpdate"></Router>
        <TenantList ref="tenant"></TenantList>
        <TenantAdd ref="tenantAdd"></TenantAdd>
    </div>
</template>


<script>
import { schemaList,schemaGet,schemaDelete ,schemaUpdate,schemaCreate,schemaGenerate,schemaGenerateRemove} from '../../api/schema';
import { routerList,routerRemove ,routerAdd} from '../../api/router';
import  moment from 'moment'
import Router from './Routers'
import TenantList from './Tenant-list'
import TenantAdd  from './Tenant-add'
export default {
    name: 'basetable',
    props:["serverData"],
    components:{
      Router,
      TenantList,
      TenantAdd
    },
    data() {
         var newReg2 = (rule, value, callback) => {
            let pattrn = /^[a-zA-Z0-9]+[.](prisma)$/
            if (!pattrn.test(value)) {
                callback(new Error("eg.xxxx.prisma"));
            } else {
                callback();
            }
         };
        return {
            tableData: [],
            editVisible: false,
            form: {
                name:null,
                content:null,
                description:null,
            },
            addFlag:false,
            loading:false,
            rules:{
                name: [{ required: true, message: "input name", trigger: "blur" },
                       { validator:newReg2 , trigger: "blur" }],
                content:[{ required: true, message: "input prisma content", trigger: "blur" }],
            }
        };
    },
    created() {
        this.getData();
    },
    filters: {
        dateFilter: value => {
        if (!value) {
            return "";
        }
        let time = new Date(value);
        return moment(time).format("YYYY-MM-DD HH:mm");
        }
   },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            this.loading=true
            schemaList(this.query).then(res => {
                this.loading=false
                this.tableData = res;
            });
        },
        //新增
        handleAdd(){
           this.addFlag=true
           this.form={ content:null,name:null,description:null }
            this.editVisible = true;

        },
       
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('delete?', 'warning', {
                type: 'warning'
            })
                .then(() => {
                    schemaDelete(row.name).then(res=>{
                       this.$message.success('delete success');
                       this.getData();
                    })
                    
                })
                .catch(() => {});
        },
       
        // 编辑操作
        handleEdit(index, row) {
            this.addFlag=false
            schemaGet(row.name).then(res=>{
                this.form={
                    content:res,
                    name:row.name,
                    description:row.description
                }
            })
            this.editVisible = true;

        },
        handleGenerate(index,row){
             this.$confirm('执行generate前确保schema文件格式正确', '提示', {
                type: 'warning'
            }).then(() => {
                  this.loading=true
                    schemaGenerate(row.name).then(res=>{
                        this.$message.success(`generate success`);
                         this.loading=false
                         this.getData();
                    }).catch(err=>{
                        this.loading=false
                    })
                })
        },
        handleRemove(index,row){
            this.$confirm('删除client将卸载路由', '提示', {
                type: 'warning'
            }).then(() => {
                 this.loading=true
                schemaGenerateRemove(row.name).then(res=>{
                    this.$message.success(`remove client success`);
                    this.loading=false
                    this.getData();
                 }).catch(err=>{
                        this.loading=false
                 })
            })
        },
        // 保存编辑
        saveEdit() {
             this.$refs["form"].validate(async valid => {
                 if(valid){
                    if(!this.addFlag){
                        schemaUpdate(this.form.name,this.form).then(res=>{
                            this.editVisible = false;
                            this.$message.success(`edit [${this.form.name} ]success`);
                            this.getData();
                        })
                    }else{
                        schemaCreate(this.form.name,this.form).then(res=>{
                            this.editVisible = false;
                            this.$message.success(`add new success`);
                            this.getData();
                        })
                    }
                 }
             })
           
        },
        handleTenant(command,data){
            if(data.$el.id=="list"){
                this.$refs.tenant.show(command.name)
           }
           if(data.$el.id=="add"){
               this.$refs.tenantAdd.show(command.name)
           }
         
        },
        
       handleRouter(command,data){
       
           if(data.$el.id=="up"){
               this.$refs.router.show(command.name)
           }
          if(data.$el.id=="down"){
                routerRemove(command.name).then(res=>{
                 this.getData();
                 this.$message.success(`remove [${command.name}] success `);
              }) 
           }
           if(data.$el.id=="graphql"){
              const xx=`/graphql/${command.name.split('.')[0]}`
              window.open(`http://${this.serverData.host}:${this.serverData.port}${xx}`, "_blank"); 
           }
           if(data.$el.id=="swagger"){
                const xxx=`/api/${command.name.split('.')[0]}/swagger`
                console.log(xxx)
              window.open(`http://${this.serverData.host}:${this.serverData.port}${xxx}`, "_blank");
           }
       },
       routerUpdate(){
           this.getData();
       }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.black{
    color: #000000;

}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
