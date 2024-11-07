class MusicManager {
  private loginBgm = new Audio("/assets/bgm/loginbgm.mp3");
  private childBgm = new Audio("/assets/bgm/childbgm.mp3");

  constructor() {
    this.loginBgm.loop = true;
    this.childBgm.loop = true;

    // 페이지 로드 시 음소거 상태로 자동 재생
    this.loginBgm.muted = true;
    this.childBgm.muted = true;

    this.syncWithLocalStorage();

    // 일정 시간 이후 음소거 해제하여 소리 재생 시도
    setTimeout(() => {
      this.setMuted(false); // 음소거 해제
    }, 3000); // 3초 후 음소거 해제
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

  public playLoginBgm() {
    this.stopBgm();
    this.tryPlayAudio(this.loginBgm); // 재생 시도
    localStorage.setItem("loginBgm", "true");
    localStorage.setItem("childBgm", "false");
  }

  public playChildBgm() {
    this.stopBgm();
    this.tryPlayAudio(this.childBgm); // 재생 시도
    localStorage.setItem("loginBgm", "false");
    localStorage.setItem("childBgm", "true");
  }

  public stopBgm() {
    this.loginBgm.pause();
    this.childBgm.pause();
    this.loginBgm.currentTime = 0;
    this.childBgm.currentTime = 0;
    localStorage.setItem("loginBgm", "false");
    localStorage.setItem("childBgm", "false");
  }

  public setMuted(muted: boolean) {
    this.loginBgm.muted = muted;
    this.childBgm.muted = muted;
  }

  private async tryPlayAudio(audio: HTMLAudioElement) {
    try {
      await audio.play();
    } catch  {
      console.warn("자동 재생 실패, 음소거 상태로 재생 시도");
      audio.muted = true;
      await audio.play();
      audio.muted = false;
    }
  }
}

export default new MusicManager();
