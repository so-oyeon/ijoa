class MusicManager {
  private loginBgm = new Audio("/assets/bgm/loginbgm.mp3");
  private childBgm = new Audio("/assets/bgm/childbgm.mp3");

  constructor() {
    this.loginBgm.loop = true;
    this.childBgm.loop = true;
    this.syncWithLocalStorage();
  }

  // localStorage와 동기화하여 초기 상태 설정
  private syncWithLocalStorage() {
    const isLoginBgmPlaying = localStorage.getItem("loginBgm") === "true";
    const isChildBgmPlaying = localStorage.getItem("childBgm") === "true";

    if (isLoginBgmPlaying) {
      this.playLoginBgm();
    } else if (isChildBgmPlaying) {
      this.playChildBgm();
    } else {
      this.stopBgm();
    }
  }

  // 로그인 BGM 재생 및 상태 저장
  public playLoginBgm() {
    this.stopBgm();
    this.loginBgm.play();
    localStorage.setItem("loginBgm", "true");
    localStorage.setItem("childBgm", "false");
  }

  // 자녀 BGM 재생 및 상태 저장
  public playChildBgm() {
    this.stopBgm();
    this.childBgm.play();
    localStorage.setItem("loginBgm", "false");
    localStorage.setItem("childBgm", "true");
  }

  // BGM 정지 및 상태 초기화
  public stopBgm() {
    this.loginBgm.pause();
    this.childBgm.pause();
    localStorage.setItem("loginBgm", "false");
    localStorage.setItem("childBgm", "false");
  }
}

export default new MusicManager();
