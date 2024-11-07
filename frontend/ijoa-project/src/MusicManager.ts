class MusicManager {
  private loginBgm = new Audio("/assets/bgm/loginbgm.mp3");
  private childBgm = new Audio("/assets/bgm/childbgm.mp3");

  constructor() {
    this.loginBgm.loop = true;
    this.childBgm.loop = true;
    this.syncWithLocalStorage();

    // 초기 로드 시 음소거 상태로 재생 시도
    this.loginBgm.muted = true;
    this.childBgm.muted = true;

    setTimeout(() => {
      this.setMuted(false); // 음소거 해제
    }, 1000); // 3초 후 음소거 해제
  }

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
    this.tryPlayAudio(this.loginBgm); // 현재 위치에서 재생 시도
    localStorage.setItem("loginBgm", "true");
    localStorage.setItem("childBgm", "false");
  }

  public playChildBgm() {
    this.stopBgm();
    this.tryPlayAudio(this.childBgm); // 현재 위치에서 재생 시도
    localStorage.setItem("loginBgm", "false");
    localStorage.setItem("childBgm", "true");
  }

  public stopBgm() {
    this.loginBgm.pause();
    this.childBgm.pause();
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
    } catch {
      console.warn("자동 재생 실패, 음소거 상태로 재생 시도");
      audio.muted = true;
      await audio.play();
      audio.muted = false; // 음소거 해제
    }
  }
}

export default new MusicManager();
