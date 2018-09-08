
//实时
function WebPlayWnd::OnBtnClicked(nIndex, nType) {
  handleClick(nIndex, nType, vh, bpBtn.state.video);
}

function WebPlayWnd::OnShowBar(nIndex) {
  if (vh) {
    bpBtn.state.video[nIndex] || (bpBtn.state.video[nIndex] = [false, false, false, false]);
    var state = bpBtn.state.video[nIndex];
    bpBtn.SetButtonStatus(state[0], state[1], state[2], state[3], vh);
  }
}

function WebPlayWnd::OnMouseMove(nIndex){
  window.handleDrag && window.handleDrag();
}

function WebIC::OnResponseHandle(a, b){
  var result = b;
  if(typeof b =='string'){
    result = JSON.parse(b);
  }
  if(typeof vh.ocxQueue[a] == 'function'){
    vh.ocxQueue[a](result);
    delete vh.ocxQueue[a];
    if(typeof pkvh !='undefined'){
      delete pkvh.ocxQueue[a];
    }
  }
  if(typeof pkvh !='undefined' && typeof pkvh.ocxQueue[a] == 'function'){
    pkvh.ocxQueue[a](result);
    delete pkvh.ocxQueue[a];
  }
}


//录像
function pkWebPlayWnd::OnBtnClicked(nIndex, nType) {
  handleClick(nIndex, nType, pkvh, bpBtn.state.pkvideo);
}

function pkWebPlayWnd::OnShowBar(nIndex) {
  if (pkvh) {
    bpBtn.state.pkvideo[nIndex] || (bpBtn.state.pkvideo[nIndex] = [false, false, false, false]);
    var state = bpBtn.state.pkvideo[nIndex];
    bpBtn.SetButtonStatus(state[0], state[1], state[2], state[3], pkvh);
  }
}

function pkWebPlayWnd::OnLMouseClient(nIndex){
  pkvh.changeWinIndexState(nIndex);
}

function pkWebPlayWnd::OnMouseMove(nIndex){
  window.handleDrag && window.handleDrag();
}

function handleClick(nIndex, nType, vh, state) {
  if (vh) {
    state[nIndex] || (state[nIndex] = [false, false, false, false]);
    var state = state[nIndex];
    /**
     * 抓图
     */
    if (nType == 5) {
      bpBtn.CapturePic(nIndex, vh);
    }
    /**
     * 本地视频
     */
    if (nType == 6) {
      if (state[2] == false) {
        state[2] = true;
        bpBtn.StartRecordLocal(nIndex, 10, vh);
      } else {
        bpBtn.StopRecordLocal(nIndex, vh);
        state[2] = false;
      }
      bpBtn.SetButtonStatus(state[0], state[1], state[2], state[3], vh);
    }
    /**
     * 及时回放
     */
    if (nType == 0) {
      if (state[3] == false) {
        state[3] = true;
      }
      vh.InstantReplay(nIndex,function(){
        state[3] = false;
        bpBtn.SetButtonStatus(state[0], state[1], state[2], state[3], vh);
      });
      bpBtn.SetButtonStatus(state[0], state[1], state[2], state[3], vh);
    }

    /**
     * 对讲
     */
    if (nType == 3) {
      if (state[1] == false) {
        vh.OpenTalk(nIndex,document.getElementById('videoOpenTalk'));
      } else {
        vh.CloseTalk(nIndex,document.getElementById('videoOpenTalk'));
      }
      state[1] = !state[1];
      bpBtn.SetButtonStatus(state[0], state[1], state[2], state[3], vh);
    }
    /**
     * 声音
     */
    if (nType == 4) {
      if (state[0] == false) {
        vh.OpenSound(nIndex);
      } else {
        vh.CloseSound(nIndex);
      }
      state[0] = !state[0];
      bpBtn.SetButtonStatus(state[0], state[1], state[2], state[3], vh);
    }

    /**
     * 关闭
     */
    if (nType == 9) {
      vh.CloseBtn(nIndex, function (index) {
        state[index] = [false, false, false, false];
        vh.handleClose();
      });
    }
  }
}

var bpBtn = {
  state: {
    video: [],
    pkvideo: []
  },
  CapturePic: function (index, vh) {
    var path = "C:\\" + index + new Date().getTime() + ".jpeg";
    vh.CapturePic(index, path)
  },
  StartRecordLocal: function (index, maxFileTime, vh) {
    var path = "C:\\" + index + new Date().getTime() + ".dav";
    vh.StartRecordLocal(index, path, maxFileTime)
  },
  SetButtonStatus: function (bAudioFlag, bTalkFlag, bRecordFlag, bQuickPlayFlag, vh) {
    vh.SetButtonStatus(bAudioFlag, bTalkFlag, bRecordFlag, bQuickPlayFlag);
  },
  StopRecordLocal: function (index, vh) {
    vh.StopRecordLocal(index);
  }
}


/**
 * 释放资源
 */
window.onbeforeunload = function(){
  deleteAllVideo ()
}
window.onunload =function(){
  deleteAllVideo ()
}
function deleteAllVideo (){
  if(window.pkvh){
    pkvh.deleteAllVideo();
  }
  if(window.vh){
    vh.deleteAllVideo();
  }
}
