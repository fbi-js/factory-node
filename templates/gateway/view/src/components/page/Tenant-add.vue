<template>
    <el-dialog title="add tenant" :visible.sync="tenantVisible" width="50%">
       <el-form ref="form" :model="form" label-width="120px"  :rules="rules">
                <el-form-item  label="name" prop="name">
                    <el-input v-model="form.name" placeholder="input tenant name">
                    </el-input>
                </el-form-item>
                <el-form-item  label="url" prop="url">
                    <el-input v-model="form.url" placeholder="input tenant db url">
                    </el-input>
                </el-form-item>
        </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tenantVisible = false">cancel</el-button>
                <el-button type="primary" @click="saveEdit">submit</el-button>
            </span>
     </el-dialog>
</template>
<script>
import { manageList,manageAdd,manageDelete} from '../../api/manage';
export default {
    name: 'tenant-add',
    data() {
        return {
            tenantVisible:false,
            form: {
                name:null,
                url:null,
                schemaName:null
            },
            rules:{
                name: [{ required: true, message: "input name", trigger: "blur" }],
                url: [{ required: true, message: "input db rul", trigger: "blur" }],
               schemaName:[{ required: true, message: "select", trigger: "blur" }],
            }
        };
    },
    methods: {
         show(schema) {
           for(let item in this.form){
               this.form[item]=null
           }
           this.form.schemaName=schema
           this.tenantVisible=true
        },
        // 保存编辑
        saveEdit() {
             this.$refs["form"].validate(async valid => {
                 if(valid){
                    manageAdd(this.form).then(res=>{
                         this.tenantVisible = false;
                        this.$message.success(`add success`);
                    })
                 }
             })
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