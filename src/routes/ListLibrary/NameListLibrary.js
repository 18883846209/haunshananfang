/**
 * @flow
 */
import React from 'react'
import { Input, Select, List, Icon, Button, Pagination, Checkbox, message, Popover, Spin } from 'antd'
import { connect } from 'dva';
import $ from 'jquery';
import styles from './NameListLibrary.less';
import ContentHeader from 'components/ContentHeader';
import DeleteTips from 'components/DeleteTips';

const Search = Input.Search
const Option = Select.Option
const { TextArea } = Input
let listCount = 8
let nameList = []
let nameListAll = []
let nametypeList = []
let pictureData = []
let selectValue = ''
// for (let i = 0; i < 15; i++) {
//   pictureData.push({
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     name: '1111'+i,
//     sex: '男',
//     weight: '60-80kg',
//     height: '160-180cm',
//     age: '20-30岁',
//     orther: '无',
//   });
// }

@connect(({ nameListLibrary, loading }) => ({
  nameListLibrary,
  loading: loading.models.nameListLibrary,
}))

export default class NameListLibrary extends React.Component {
  constructor() {
    super();
    this.state = {
      iscreateShow: false,
      ispullShow: false,
      orderFiled: 'updated_time_list_lib',
      orderRule: 'desc',
      listPage: 1,
      modalLeft: null,
      modalTop: null,
      pictureList: [],
      taskname: '',
      taskid: '',
      taskExport: '',
      isturn: false,
      listtype: '',
      isnew: '',
      isauthor_list_libup: true,
      iscreated_time_list_libup: true,
      isupdated_time_list_libup: true,
      checkList: {},
      checkAllState: false,
      searchKey: '',
      imgUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      imgName: '1111',
      imgSex: '男',
      imgWeight: '60-80kg',
      imgHeight: '160-180cm',
      imgAge: '20-30岁',
      imgOrther: '无',
      imgMask: '无',
      checkedData: [],
      picturePage: 1,
      pictureId: '',
      clickdata:'',
      hasDelMask: false
    }
    this.moving = false;
    this.startX = 0;
    this.startY = 0;
  }

  imageUrl = window.SSystem.imageUrl ||  '';

  componentDidMount() {
    window.document.title = '名单库管理';
    window.addEventListener('keydown', this.delKeyDown)
    message.config({
      top: 50,
      duration: 1,
      maxCount: 1,
    });
    $('#createmodel').hide();
    $('#pullmodel').hide();
    $('#pictureModal').hide();
    this.getlist();
    this.props.dispatch({ type: 'nameListLibrary/getnametype' })
    this.props.dispatch({// 获取所有布控库名称
      type: 'nameListLibrary/getnamelistall',
    })

  }


  onModalMouseDown = (e) => {
    if (e !== undefined) {
      this.moving = true;
      this.startX = e.clientX;
      this.startY = e.clientY;
    }

  }

  onModalMouseUp = (e) => {
    if (this.moving) {
      const left = e.clientX - this.startX
      const top = e.clientY - this.startY
      if (left > 5 || left < -5) {
        this.setState({
          modalLeft: left,
        })
      }
      if (top > 5 || top < -5) {
        this.setState({
          modalTop: top,
        })
      }
      this.moving = false;
    }
  }

  createnewlist = () => {
    $('#createmodel').show();
    this.setState({
      // ispullShow: false,
      iscreateShow: true,
      isturn: true,
    })
    this.resetModle('pull')
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  resetModle = (e) => {
    if (e === 'create') {
      $('#taskName').val('')
      $('#taskType').val('')
      $('#taskRemark').val('')
    }
    else if (e === 'pull') {
      this.setState({
        pictureList: [],
        taskid: '',
        taskExport: '',
      })
      $('#namelist').val('')
    }

  }

  deletePicture = (i) => {
    this.setState(({ pictureList }) => {
      const newFileList = pictureList.slice();
      newFileList.splice(i, 1);
      return {
        pictureList: newFileList,
      };
    });
  }


  onMouseMove = (e) => {
    if (this.moving) {
      const left = e.clientX - this.startX
      const top = e.clientY - this.startY
      if (left > 5 || left < -5) {
        this.setState({
          modalLeft: left,
        })
      }
      if (top > 5 || top < -5) {
        this.setState({
          modalTop: top,
        })
      }
    }
  }

  onModalMouseDown = (e) => {
    this.moving = true
    this.startX = e.clientX;
    this.startY = e.clientY;
  }

  onModalMouseUp = (e) => {
    this.moving = false;

  }

  tollChange = (e) => {
    this.setState({ listtype: e })
  }

  nameChange = (value, option) => {
    const id = option.key.split(',,')[0];
    this.setState({ taskid: id })
  }

  pull = () => {
    document.getElementById("pullOk").disabled = true;
    const piture = this.state.pictureList;
    const typeid = this.state.taskid;
    const fd = new FormData();
    setTimeout(() => {
      document.getElementById("pullOk").disabled = false;
    }, 3000)
    if (typeid === "") {
      message.info("请选择名单库");
      return false;
    } else if (piture.length === 0) {
      message.info("请选择图片");
      return false;
    }
    for (let i = 0; i < piture.length; i++) {
      fd.append("images", piture[i]);
    }
    fd.append("idListLib", typeid);
    this.props.dispatch({
      type: 'nameListLibrary/importPic',
      payload: fd,
    })
    
  }

  add = () => {
    document.getElementById("createOk").disabled = true;
    const { listtype, isturn } = this.state;
    const title = $('#taskName').val();
    const listtype1 = listtype;
    const reason = $('#taskRemark').val();
    setTimeout(() => {
      document.getElementById("createOk").disabled = false;
    }, 3000)
    if (title === "") {
      message.info("请填写新建名单库名称");
      return false;
    } else if (listtype1 === "") {
      message.info("请选择名单库类型");
      return false;
    }
    else if (listtype1 === "") {
      message.info("请填写说明");
      return false;
    }
    const list = {
      nameListLib: title,
      typeListLib: listtype1,
      descListLib: reason,
    }
    this.props.dispatch({
      type: 'nameListLibrary/creatNewList',
      payload: list,
    })
    if (isturn === true) {
      this.setState({
        taskname: title,
        isturn: false,
        //  ispullShow: true,
        iscreateShow: false,
      });
      $('#createmodel').hide();
      this.resetModle('create');
    }
    selectValue = title;
    
  }

  getHeightShow = (e, w, h) => {
    const image = new Image();
    image.src = e.target.src;
    let reW = 0; let reH = 0
    if (image.width <= w && image.height <= h) {
      reW = image.width;
      reH = image.height;
    }
    else
      if (w / h <= image.width / image.height) {
        reW = w;
        e.target.style.width = `${w  }px`;
        reH = w * (image.height / image.width);
        e.target.style.height = `${reH}px`;
      }
      else {
        reW = h * (image.width / image.height);
        e.target.style.height = `${h  }px`;
        e.target.style.width = `${reW}px`;
        reH = h;
      }
    e.target.style.display = 'inline-block';
  }

  // 选择导入图片
  Upload = (e) => {
    const _this = this
    const filetypes = ["image/jpeg", "image/png"]
    const filemaxsize = 1024 * 1;
    const { pictureList } = this.state
    const files = e.currentTarget.files
    for (let i = 0; i < files.length; i++) {
      if (filetypes.indexOf(files[i].type) < 0) {
        message.info("图片格式错误，请重新选择。");
        $("#upload").val("");
        return false;
      }
    }
    for (let i = 0; i < files.length; i++) {
      if (files[i].size / 1024 > filemaxsize) {
        message.info("所选择的图片超过1M,请重新选择。");
        $("#upload").val("");
        return false;
      }
      const reader = new FileReader()
      const file = files[i]
      reader.readAsDataURL(file)
      reader.onload = function (event) {
        const url = event.target.result
        file.url = url
        if (pictureList !== []) {
          for (let m = 0; m < pictureList.length; m++) {
            if (file.name === pictureList[m].name) {
              message.info("已选择该图片。");
              return false
            }
          }
        }
        _this.setState(({ pictureList }) => ({
          pictureList: [...pictureList, file],
        }))
      }
    }
    $("#upload").val("");
  }

  // 显示弹框
  showModal = (e, i, id, name) => {
    if (e === 'create') {
      document.getElementById("createOk").disabled = false;
      $('#createmodel').show();
      this.setState({
        iscreateShow: true,
      })
    } else if (e === 'pull') {
      document.getElementById("pullOk").disabled = false;
      $('#pullmodel').show();
      this.setState({
        ispullShow: true,
        isnew: i,
      })
      if (i === '1') {
        this.setState({
          taskid: id,
          taskExport: name,
        })
      }
    } else if (e === 'push') {
      message.info("开发中，本期暂不提供该功能")
    } else if (e === 'picture') {
      $('#pictureModal').show();
    }
  }

  handleOk = (e) => {
    if (e === 'create') {
      $('#createmodel').hide();
      this.setState({
        iscreateShow: false,
      })
      this.resetModle('create')
    } else if (e === 'pull') {
      $('#pullmodel').hide();
      this.setState({
        ispullShow: false,
      })
      this.resetModle('pull')
    }
  }

  handleCancel = (e) => {
    if (e === 'create') {
      $('#createmodel').hide();
      // this.setState({
      //   iscreateShow: false,
      // })
      this.resetModle('create')
    } else if (e === 'pull') {
      $('#pullmodel').hide();
      // this.setState({
      //   ispullShow: false,
      // })
      this.resetModle('pull')
    } else if (e === 'picture') {
      $('#pictureModal').hide();
    }
  }

  onSearch = (value) => {
    if (value === '' || value === null) {
      message.info('请输入搜索关键字')
    } else {
      this.setState({ searchKey: value });
      const list = {
        searchKey: value,
        page: 1,
        size: 9,
        order: 'updated_time_list_lib',
        desc: 'desc',
        datetime:(new Date()).valueOf(),
      }
      this.props.dispatch({
        type: 'nameListLibrary/getnamelist',
        payload: list,
      })
    }
  }

  order = (id, rule) => {
    this.setState({
      checkAllState: false,
      checkedData: [],
    })
    const { searchKey } = this.state;
    const list = {
      searchKey,
      page: 1,
      size: 9,
      order: id,
      desc: rule,
      datetime:(new Date()).valueOf(),
    }
    this.props.dispatch({
      type: 'nameListLibrary/getnamelist',
      payload: list,
    })
  }

  // 获取布控库列表
  getlist = () => {
    this.setState({
      checkAllState: false,
      checkedData: [],
    })
    const list1 = {
      searchKey: '',
      page: 1,
      size: 9,
      order: 'updated_time_list_lib',
      desc: 'desc',
      datetime:(new Date()).valueOf(),
    }
    this.props.dispatch({
      type: 'nameListLibrary/getnamelist',
      payload: list1,
    })

  }

  returnback = () => {
    message.info("开发中，本期暂不提供该功能")
  }

  selectFn = (value, option) => {
    this.setState({ taskExport: value })
  }

  selectFilter = (inputValue, option) => {
    const arr = option.key.split(',,');
    if (arr[1].includes(inputValue)) {
      return true
    }
  }

  showDelMask = (p1) => {
    const c1 = p1;
    this.setState({
      clickdata:c1,
      hasDelMask: true
    })
    // this.refs.del_cancel.style.display = 'block';
    // document.getElementById('delmask').style.display = 'block';
  }

  delKeyDown = (e) => {
    // console.log(e.key === 'Enter');
    e.stopPropagation();
    if (this.state.hasDelMask && e.key === 'Enter') {
      this.deleteLib(this.state.clickdata);
    }
    this.setState({
      hasDelMask: false
    })
  }

  delConfirm = () => {
    this.setState({
      hasDelMask: false
    })
    this.deleteLib(this.state.clickdata);
  }

  delCancel = () => {
    this.setState({
      hasDelMask: false
    })
  }

  componentWillReceiveProps(nextProps) {
    const { ispullShow, taskname } = this.state
    const { nameListLibrary } = nextProps
    if (nameListLibrary.namelistResult !== undefined) {
      if (nameListLibrary.namelistResult.code === 1) {
        listCount = nameListLibrary.namelistResult.totalCount
        this.setState({
          listCount,
        })
        // let page = nameListLibrary.namelistResult.data.currentPage - 1
        // if(nameListLibrary.namelistResult.data.length>0){
        nameList = nameListLibrary.namelistResult.data
        // nameListAll = nameListLibrary.nameListAll.data
        // this.initCheckList(nameListAll);
        // if(initOnce === 0)  {
        //   initOnce++
        // }
        for (let i = 0; i < nameList.length; i++) {
          if (taskname === nameList[i].nameListLib) {
            this.setState({ taskid: nameList[i].idListLib })
          }
        }

        // }
      }
    }
    // console.log(listCount, 'list');
    if (nameListLibrary.nameListAll !== undefined) {
      if (nameListLibrary.nameListAll.code === 1) {
        nameListAll = nameListLibrary.nameListAll.data
        this.initCheckList(nameListAll);
        nameListLibrary.nameListAll = {}
      }
    }
    if (nameListLibrary.typeList !== undefined) {
      if (nameListLibrary.typeList.code === 1) {
        nametypeList = nameListLibrary.typeList.data;
        nameListLibrary.typeList = {}
      }
    }
    if (nameListLibrary.deleteRes&&nameListLibrary.deleteRes.code!==undefined) {
      console.log(nameListLibrary.deleteRes.code)
      if (nameListLibrary.deleteRes.code === 1) {
        message.info('删除成功！')
        this.getlist();
      }else{
        message.info('删除失败！')
      }
      nameListLibrary.deleteRes = {}
    }
    if (nameListLibrary.pictureRes !== undefined) {
      if (nameListLibrary.pictureRes.code === 1) {
        if (nameListLibrary.pictureRes.data.length > 0) {
          if (this.state.picturePage === 1) {
            pictureData = nameListLibrary.pictureRes.data
            this.imgClick(pictureData[0])
          } else {
            pictureData = [...pictureData, ...nameListLibrary.pictureRes.data]
          }
          $('#pictureModal').show();
          if (pictureData.length >= 20) {
            $('#pictureMore').show();
          } else {
            $('#pictureMore').hide();
          }
        } else if (this.state.picturePage === 1) {
            message.info("暂无图片")
          } else {
            message.info("无更多图片")
          }
      } else if (nameListLibrary.pictureRes.code === 0){
        message.info(nameListLibrary.pictureRes.message)
      }
      nameListLibrary.pictureRes = {}
    }
    if (nameListLibrary.addlist !== undefined) {
      if (nameListLibrary.addlist.code === 1) {
        this.props.dispatch({// 获取所有布控库名称
          type: 'nameListLibrary/getnamelistall',
        })
        if (ispullShow !== true) {
          message.info('添加成功');
        }
        this.getlist();
        $('#createmodel').hide();
        this.setState({ iscreateShow: false })
        this.resetModle('create');
        this.setState({ taskExport: selectValue })
      } else if (nameListLibrary.addlist.code === 0) {
        message.info(nameListLibrary.addlist.message)
        document.getElementById("createOk").disabled = false;
        // nameListLibrary.addlist.code=111
      }
      nameListLibrary.addlist = {}
    }
    if (nameListLibrary.importRes !== undefined) {
      if (nameListLibrary.importRes.code === 1) {
        message.info('添加成功');
        this.getlist();
        $('#pullmodel').hide();
        this.setState({ ispullShow: false })
        this.resetModle('pull');
      } else if (nameListLibrary.importRes.code === 0) {
        document.getElementById("pullOk").disabled = false;
        message.info(nameListLibrary.importRes.message)
        // nameListLibrary.importRes.code=111
      }
      nameListLibrary.importRes = {}
    }
  }
  disScroll = (e) => {
    e.stopPropagation();
    e.preventDefault(); 
  }
  render() {
    const { hasDelMask, pictureList, taskExport, searchKey, imgSex, imgName, imgAge, imgUrl, imgWeight, imgOrther, imgHeight, imgMask } = this.state

    const suffix = searchKey ? <Icon type="close-circle-o" className={styles.seach_icon} onClick={this.emitEmpty} /> : null
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <DeleteTips deleteSure={this.delConfirm} deleteCancel={this.delCancel} deleteStyle={{ display: hasDelMask ? 'block' : 'none' }}/>
        <div style={{ width: '100%', height: '100%' }}>
          <ContentHeader contentTitle='名单库管理'/>
          <div className={styles.content_div}>

            <div style={{ margin: 10, paddingTop: 10 }}>
              <Search
                style={{ marginLeft: 10, width: 280 }}
                placeholder="示例:编号/名称/布控人员"
                suffix={suffix}
                value={searchKey}
                onChange={this.onChangeSearchKey}
                onSearch={(value) => this.onSearch(value)}
                ref={node => this.userNameInput = node}
                enterButton
              />
              {/* <Icon type="close-circle-o" className={styles.seach_icon} /> */}
              <Button type="primary" icon="upload" style={{ float: 'right', marginRight: 10 }} onClick={() => this.doExport()}>导出</Button>
              <Button type="primary" icon="download" style={{ float: 'right', marginRight: 10 }} onClick={() => this.showModal('pull', '0')}>导入</Button>
              <Button type="primary" icon="plus" style={{ float: 'right', marginRight: 10 }} onClick={() => this.showModal('create', '')}>新建</Button>
              <div id="createmodel">
                <div className={styles.model_mask} style={{ zIndex: 1014 }} />
                <div className={styles.model_wrap} style={{ zIndex: 1014 }}>
                  <div className={styles.model_content} style={{ top: 123, left: '4%' }}>
                    <div className={styles.model_content_i} style={{ top: this.state.modalTop, left: this.state.modalLeft }}>
                      <button className={styles.model_close} onClick={() => this.handleCancel('create')}>
                        <span className={styles.model_close_x} />
                      </button>
                      <div id="model_title" className={styles.model_header}>
                        <div className={styles.model_header_title}>新建名单库</div>
                      </div>
                      <div className={styles.model_body}>
                        <div style={{ padding: 24 }} onMouseDown={this.onModalMouseDown} onMouseUp={this.onModalMouseUp}>

                          <div style={{ marginBottom: 20, marginTop: 20 }}>
                            <div className={styles.div_name}>名单库名称<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <Input id="taskName" placeholder="请输入名单库名称，名称不可重复" style={{ width: '62%' }} />
                          </div>

                          <div style={{ marginBottom: 20 }}>
                            <div className={styles.div_name}>名单库类型<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <Select id="taskType" className={styles.taskType} defaultValue="选择名单库类型" style={{ width: '62%' }} onChange={this.tollChange}>
                              {nametypeList.map(item => (<Option key={item.id}>{item.name}</Option>))}
                            </Select>
                          </div>

                          <div style={{ marginBottom: 20, height: 100 }}>
                            <div className={styles.div_name}>说明<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <TextArea id="taskRemark" autosize={{minRows: 4, maxRows: 4}} maxLength="30" placeholder="请控制在30字以内" style={{ float: 'left', width: '62%' }} />
                          </div>

                          <div style={{ marginBottom: 20, height: 45 }}>
                            <div style={{ width: '81%' }}>
                              <Button type="primary" ghost style={{ float: 'right' }} onClick={() => this.resetModle('create')}>重置</Button>
                              <Button id="createOk" type="primary" style={{ float: 'right', marginRight: 20 }} onClick={this.add}>确认</Button>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div id="pullmodel">
                <div className={styles.model_mask} />
                <div className={styles.model_wrap}>
                  <div className={styles.model_content}>
                    <div className={styles.model_content_i} style={{ top: this.state.modalTop, left: this.state.modalLeft, width: 755 }}>
                      <button className={styles.model_close} onClick={() => this.handleCancel('pull')}>
                        <span className={styles.model_close_x} />
                      </button>
                      <div id="model_title" className={styles.model_header}>
                        <div className={styles.model_header_title}>导入名单库</div>
                      </div>
                      <div className={styles.model_body}>
                        <div style={{ padding: 24 }} onMouseDown={this.onModalMouseDown} onMouseUp={this.onModalMouseUp}>
                          <div style={{ marginBottom: 20, marginTop: 20 }}>
                            <div className={styles.div_name}>名单库选择<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <Select showSearch filterOption={this.selectFilter} id="namelist" onSelect={this.selectFn} value={taskExport} style={{ width: '62%' }} onChange={this.nameChange}>
                              {nameListAll && nameListAll.map(item => (
                                <Option key={`${item.idListLib},,${item.nameListLib}`}>{item.nameListLib}</Option>
                              ))}
                            </Select>
                            <div style={{ display: `${this.state.isnew === '1' ? 'none' : 'inline-block'}` }} onClick={this.createnewlist}>
                              <Icon type="plus-square-o" style={{ color: '#2080da', fontSize: 16, margin: 10 }} />
                              <span style={{ color: '#2080da' }}>新建名单库</span>
                            </div>
                          </div>
                          <div style={{ marginBottom: 20 }}>
                            <div className={styles.div_name}>上传图片<span style={{ color: 'red', marginLeft: 5 }}>*</span></div>
                            <div className={styles.picturebox1} style={{ width: 107 }}>
                              <input
                                className={styles.input}
                                multiple="multiple"
                                type="file"
                                id="upload"
                                onChange={this.Upload}
                              />
                              <Icon className={styles.add} type="plus" />
                            </div>
                            <div className={styles.imageflow1}>
                              <div style={{ position: 'relative', top: '-11px' }}>
                                {pictureList.map((item, i) => (
                                  <div className={styles.picturebox2}>
                                    <li className={styles.picture_li}>
                                      <img alt="11" id={item.name} style={{ display: 'none' }} src={item.url} className={styles.image} onLoad={(e) => this.getHeightShow(e, 90, 60)} />
                                    </li>
                                    <Icon type="close-circle" className={styles.image_icon} onClick={() => this.deletePicture(i)} />
                                  </div>
                                ))
                                }
                              </div>
                            </div>
                          </div>
                          <div style={{ height: 45 }}>
                            <div style={{ width: '93%' }}>
                              <Button type="primary" className={styles.cancel} style={{ float: 'right', marginRight: 20, color: '#2080da', backgroundColor: '#fff' }} onClick={() => this.handleCancel('pull')}>取消</Button>
                              <Button id="pullOk" type="primary" style={{ float: 'right', marginRight: 20 }} onClick={this.pull}>确认</Button>

                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
              <div id="pictureModal">
                <div className={styles.model_mask} />
                <div className={styles.model_wrap}>
                  <div className={styles.model_content}>
                    <div className={styles.model_content_i} style={{ top: this.state.modalTop, left: this.state.modalLeft, width: 755 }}>
                      <button className={styles.model_close} onClick={() => this.handleCancel('picture')}>
                        <span className={styles.model_close_x} />
                      </button>
                      <div id="model_title" className={styles.model_header}>
                        <div className={styles.model_header_title}>图片信息</div>
                      </div>
                      <div className={styles.model_body}>
                        <div style={{ height: 400 }}>
                          <div className={styles.picture_div}>
                            {pictureData.map((item) => (
                              <div style={{ display: 'inline-block' }}>
                                <li className={styles.img_li} onClick={() => this.imgClick(item)}>
                                  <img alt="11" src={this.imageUrl + item.imagestorageurl} style={{ width: 100, height: 70, display: 'none' }} onLoad={(e) => this.getHeightShow(e, 100, 70)} />
                                </li>
                                {/* <div style={{textAlign:'center'}}>{item.name}</div> */}
                              </div>
                            ))}
                            <div id="pictureMore" style={{ textAlign: 'center', color: '#2080da', cursor: 'pointer' }}><span onClick={this.getMorePic}>获取更多</span></div>
                          </div>
                          <div className={styles.desc_div}>
                            <div>
                              <div className={styles.img_big}>
                                <img alt='' src={imgUrl} className={styles.showpic} onLoad={(e) => this.getHeightShow(e, 200, 130)} />
                              </div>
                              <div style={{ textAlign: 'center', width: 200 }}>{imgName}</div>
                            </div>
                            <div style={{ paddingLeft: 20 }}>
                              <div style={{ margin: 10 }}><span style={{ color: '#2080da' }}>性别：</span><span>{imgSex}</span> </div>
                              <div style={{ margin: 10 }}><span style={{ color: '#2080da' }}>年龄：</span><span>{imgAge}</span> </div>
                              <div style={{ margin: 10 }}><span style={{ color: '#2080da' }}>胡须：</span><span>{imgWeight}</span> </div>
                              <div style={{ margin: 10 }}><span style={{ color: '#2080da' }}>肤色：</span><span>{imgHeight}</span> </div>
                              <div style={{ margin: 10 }}><span style={{ color: '#2080da' }}>眼镜：</span><span>{imgOrther}</span> </div>
                              <div style={{ margin: 10 }}><span style={{ color: '#2080da' }}>面具：</span><span>{imgMask}</span> </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div id="listheight" className={styles.listheight_namelist}>
              <Spin spinning={this.props.loading}>
                <List
                  header={
                    <div className={styles.listtitle}>
                      <div className={styles.list_line1} style={{ width: '6%' }}>
                        <Checkbox checked={this.state.checkAllState} onChange={(e) => this.changeCheckAll(e)} />

                      </div>
                      <div className={styles.list_line1} style={{ width: '4%' }}>
                        序号
                      </div>
                      <div className={styles.list_line1} style={{ width: '12%' }}>
                        ID编号
                      </div>
                      <div className={styles.list_line1} style={{ width: '14%' }}>
                        名单库名称
                      </div>
                      <div className={styles.list_line1} style={{ width: '8%' }}>
                        名单库分类
                      </div>
                      <div className={styles.list_line1} style={{ width: '4%' }}>
                        图片数量
                      </div>
                      <div className={styles.list_line1} style={{ width: '8%' }} id="author_list_lib" onClick={() => this.doSort('author_list_lib', this.state.isauthor_list_libup ? 'asc' : 'desc')}>
                        创建人
                        <Icon type="caret-up" id="author_list_libup" style={{ display: 'none', marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                        <Icon type="caret-down" id="author_list_libdown" style={{ marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                      </div>
                      <div className={styles.list_line1} style={{ width: '12%' }} id="created_time_list_lib" onClick={() => this.doSort('created_time_list_lib', this.state.iscreated_time_list_libup ? 'asc' : 'desc')}>
                        创建时间
                        <Icon type="caret-up" id="created_time_list_libup" style={{ display: 'none', marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                        <Icon type="caret-down" id="created_time_list_libdown" style={{ marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                      </div>
                      <div className={styles.list_line1} style={{ width: '12%' }} id="updated_time_list_lib" onClick={() => this.doSort('updated_time_list_lib', this.state.isupdated_time_list_libup ? 'asc' : 'desc')}>
                        最后修改时间
                        <Icon type="caret-up" id="updated_time_list_libup" style={{ display: 'none', marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                        <Icon type="caret-down" id="updated_time_list_libdown" style={{ marginLeft: '3px', fontSize: 12, cursor: 'pointer' }} />
                      </div>
                      <div className={styles.list_line1} style={{ width: '10%' }}>
                        创建说明
                      </div>
                      <div className={styles.list_line1} style={{ width: '10%' }}>
                        操作
                      </div>
                    </div>}
                  itemLayout="vertical"
                  size="small"
                  dataSource={nameList}
                  renderItem={(item, index) => (
                    <List.Item key={item.title}>
                      <div className={`${((this.state.listPage - 1) * 9 + index + 1) % 2 === 0 ? `${styles.item_div0}` : `${styles.item_div1}`}`}>
                        <div className={styles.list_line} style={{ width: '6%' }}>
                          <Checkbox
                            checked={this.state.checkList[item.idListLib] ? this.state.checkList[item.idListLib].checkState : false}
                            onChange={(e) => this.changeCheck(e, item.idListLib)}
                          />
                        </div>
                        <div className={styles.list_line} style={{ width: '4%' }}>
                          {(this.state.listPage - 1) * 9 + index + 1}
                        </div>
                        <div className={styles.list_line} style={{ width: '12%', color: '#2080da' }}>
                          <span onClick={() => this.getPictures(item.idListLib)} style={{ textDecoration: 'underline', cursor: 'pointer' }}>{item.idListLib}</span>
                        </div>
                        <div className={styles.list_line} style={{ width: '14%' }}>
                          {item.nameListLib}
                        </div>
                        <div className={styles.list_line} style={{ width: '8%' }}>
                          {item.typeListLib}
                        </div>
                        <div className={styles.list_line} style={{ width: '4%' }}>
                          {item.imageCnt}
                        </div>
                        <div className={styles.list_line} style={{ width: '8%' }}>
                          {item.authorListLib}
                        </div>
                        <div className={styles.list_line} style={{ width: '12%' }}>
                          {item.createdTimeListLib}
                        </div>
                        <div className={styles.list_line} style={{ width: '12%' }}>
                          {item.updatedTimeListLib}
                        </div>
                        <div className={styles.list_line} style={{ width: '10%' }}>
                          {this.showDesc(item.descListLib)}
                        </div>
                        <div className={styles.list_line} style={{ width: '10%' }}>
                          <Popover content="导入">
                            <Icon type="download" className={styles.icon_tool} onClick={() => this.showModal('pull', '1', item.idListLib, item.nameListLib)} />
                          </Popover>
                          <Popover content="编辑">
                            <Icon type="edit" className={styles.icon_tool} onClick={this.returnback} />
                          </Popover>
                          <Popover content="删除">
                            <Icon type="delete" className={styles.icon_tool} onClick={(p1) => this.showDelMask(item)} />
                          </Popover>
                          <Popover content="详情">
                            <Icon type="profile" className={styles.icon_tool} onClick={() => this.getPictures(item.idListLib)} />
                          </Popover>
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </Spin>
            </div>
            <div style={{ float: 'right', display: 'flex', position: 'relative', marginRight: 20 }}>
              <div className={styles.itemRenderFirst} onClick={this.toFirst} style={{ display: this.state.listCount > 0 ? 'block' : 'none' }}>首页</div>
              <Pagination
                style={{ display: 'inline-block' }}
                defaultCurrent={1}
                defaultPageSize={9}
                showQuickJumper
                total={listCount}
                onChange={this.listOnChange}
                current={this.state.listPage}
              // current={2}
              // itemRender={itemRender}
              />
              <div className={styles.itemRenderLast} onClick={this.toLast} style={{ display: this.state.listCount > 0 ? 'block' : 'none' }}>尾页</div>
              {/* <div className={ styles.inputarea }>
                <span>跳至</span>
                <input className={styles.input}></input>
                <span>页</span>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }

  showDesc = (desc) => {
    let dow = null
    if (desc) {
      if (desc.length > 6) {
        dow = (
          <Popover content={<div className={styles.desc_pop}>{desc}</div>} trigger="hover">
            <div>
              {`${desc.substring(0, 6)}···`}
            </div>
          </Popover>
        )
      } else {
        dow = (<span>{desc}</span>)
      }
      return dow
    }
  }

  // 排序
  doSort = (id, rule) => {
    this.setState({
      orderFiled: id,
      orderRule: rule,
    })
    const up = document.getElementById(`${id}up`)
    const down = document.getElementById(`${id}down`)
    if (rule === 'desc') {
      up.style.display = 'none'
      down.style.display = 'inline-block'
    } else {
      down.style.display = 'none'
      up.style.display = 'inline-block'
    }
    this.order(id, rule)
    if (id === 'author_list_lib') {
      this.setState((state) => ({
        isauthor_list_libup: !state.isauthor_list_libup,
      }))
    } else if (id === 'created_time_list_lib') {
      this.setState((state) => ({
        iscreated_time_list_libup: !state.iscreated_time_list_libup,
      }))
    } else if (id === 'updated_time_list_lib') {
      this.setState((state) => ({
        isupdated_time_list_libup: !state.isupdated_time_list_libup,
      }))
    }
  }

  listOnChange = current => {
    this.saveCheckData()
    this.setState({
      listPage: current,
    })
    const { searchKey, orderRule, orderFiled } = this.state;
    const list = {
      searchKey,
      page: current,
      size: 9,
      order: orderFiled,
      desc: orderRule,
      datetime:(new Date()).valueOf(),
    }
    this.props.dispatch({
      type: 'nameListLibrary/getnamelist',
      payload: list,
    })
    // this.changeCheckAll()
  }

  toFirst = () => {
    if (this.state.listPage !== 1) {
      this.setState({
        listPage: 1,
      })
      this.listOnChange(1);
    }
  }

  toLast = () => {
    const lastpagenum = Math.ceil(parseInt(this.state.listCount) / 9);
    // console.log(lastpagenum);
    if (this.state.listPage !== lastpagenum) {
      this.setState({
        listPage: lastpagenum,
      })
      this.listOnChange(lastpagenum);
    }
  }

  // 初始化checkbox状态
  initCheckList = (list) => {
    const { checkAllState, checkedData } = this.state
    const checkList = {}
    if (checkAllState) {
      for (const item in list) {
        checkList[list[item].idListLib] = { checkState: checkAllState }
      }
    } else {
      for (const item in list) {
        checkList[list[item].idListLib] = { checkState: false }
        for (const id in checkedData) {
          if (id === item.idListLib) {
            checkList[list[item].idListLib] = { checkState: true }
          }
        }
      }
    }

    this.setState({ 'checkList': checkList })
  }

  changeCheck = (e, id) => {
    const checkList = { ...this.state.checkList }
    let checkAllState = false
    let i = 0
    checkList[id].checkState = e.target.checked;
    for (const id in checkList) {
      if (i === 0) {
        checkAllState = checkList[id].checkState
        i++
      } else if (checkAllState != checkList[id].checkState) {
          checkAllState = false
          break;
        }
    this.setState(
      {
        checkAllState,
        checkList,
      }
    );
  }
}

  changeCheckAll = (e) => {
    const state = e ? e.target.checked : false
    const checkList = this.state.checkList
    for (const id in checkList) {
      checkList[id].checkState = state
    }
    this.setState(
      {
        'checkList': checkList,
        'checkAllState': state,
      }
    );
  }

  emitEmpty = () => {
    this.userNameInput.focus();
    this.setState({ searchKey: '' });
    this.getlist()
  }

  onChangeSearchKey = (e) => {
    this.setState({ searchKey: e.target.value });
    if (e.target.value === '') {
      this.getlist()
    }
  }

  // 获取布控图片信息
  getPictures = (id) => {
    this.setState({
      pictureId: id,
      picturePage: 1,
    })
    this.props.dispatch({
      type: 'nameListLibrary/getPictrueLists',
      payload: {
        id,
        page: 1,
        size: 20,
      },
    })
  }

  getMorePic = () => {
    const libPage = this.state.picturePage + 1
    this.setState({
      picturePage: libPage,
    })
    this.props.dispatch({
      type: 'nameListLibrary/getPictrueLists',
      payload: {
        id: this.state.pictureId,
        page: libPage,
        size: 20,
      },
    })
  }

  imgClick = (item) => {
    this.setState({
      imgUrl: this.imageUrl + item.imagestorageurl,
      imgName: item.name,
      imgAge: item.age,
      imgSex: item.gender,
      imgWeight: item.beard,
      imgHeight: item.race,
      imgOrther: item.glasses,
      imgMask: item.mask,
    })
  }

  // 导出
  doExport = () => {
    message.info("开发中，本期暂不提供该功能")
    // this.saveCheckData();
    // const { checkedData, checkAllState } = this.state
    // if(checkAllState) {

    // }else{

    // }
  }

  // 保存选中状态
  saveCheckData = () => {
    const { checkList, checkedData, checkAllState } = this.state
    if (!checkAllState) {
      for (const id in checkList) {
        if (checkList[id].checkState && checkedData.indexOf(id) === -1) {
          checkedData.push(id)
        }
      }
    }
  }

  // 删除名单库
  deleteLib = (item) => {
    this.props.dispatch({
      type: 'nameListLibrary/doDeleteLib',
      payload: {
        id: item.idListLib,
        fId: item.featurelibId,
      },
    })
  }

}
