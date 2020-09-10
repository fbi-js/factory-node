<template>
   <el-dialog title="up router" :visible.sync="routerVisible" width="30%">
            <el-form ref="form" :model="form" label-width="120px" :rules="rules">
                <el-form-item label="default tenant " prop="tenant">
                     <el-select v-model="form.tenant" placeholder="please select" >
                         <el-option
                            v-for="item in selectTenantData"
                            :key="item.name"
                            :label="item.name"
                            :value="item.name">
                            </el-option>
                        
                     </el-select>
                </el-form-item>
                <el-form-item  label="openApi">
                        <el-switch v-model="form.openapi"></el-switch>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="routerVisible = false">cancel</el-button>
                <el-button type="primary" @click="saveEdit">submit</el-button>
            </span>
    </el-dialog>
</template>

<script>
import { routerList,routerRemove ,routerAdd} from '../../api/router';
import { manageList} from '../../api/manage';
import { schemaList} from '../../api/schema';
export default {
    name: 'router',
    props:["serverData"],
    data() {
        return {
            tableData: [],
            form: {
                name:null,
                schemaName:null,
                openapi:true,
                tenant:null
            },
            schemaSelectData:[],
            rules:{
                name: [{ required: true, message: "select prisma", trigger: "blur" }],
            },
            tenantData:[],
            routerVisible:false,
            selectTenantData:[]
        };
    },
    created() {
        
    },
   
    methods: {
        show(schemaName){
            this.routerVisible=true
            this.tenantList(schemaName)
            this.form.name=schemaName
            this.form.tenant=null
        },
        cleanData(){
          this.tableData=[]
        },

        tenantList(schema){
            manageList({schemaName:schema}).then(res=>{
              this.selectTenantData=res
            })
        },
       
        // 保存编辑
        saveEdit() {
             this.$refs["form"].validate(async valid => {
                 if(valid){
                    this.editVisible = false;
                    routerAdd(this.form).then(res=>{
                        this.$message.success(`add success`);
                        this.routerVisible=false
                        this.$emit('routerUpdate')
                    })
                 }
             })
        },
        
    },

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
