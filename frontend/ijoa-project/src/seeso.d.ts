declare module "seeso" {
  export default class Seeso {
    static openCalibrationPage(
      licenseKey: string,
      userId: string,
      redirectUrl: string,
      calibrationPoint: number
    ): void;
    initialize(
      licenseKey: string,
      userStatusOption: UserStatusOption
    ): Promise<InitializationErrorType>;
    startTracking(
      stream: MediaStream,
      onGaze: (gazeInfo: any) => void,
      onDebug?: (FPS: number, latency_min: number, latency_max: number, latency_avg: number) => void
    ): Promise<void>;
    stopTracking(): void;
    setAttentionInterval(interval: number): void;
    getAttentionScore(): number;
    addGazeCallback(callback: (gazeInfo: any) => void): void;
    setCalibrationData(data: any): void;
  }

  export class UserStatusOption {
    constructor(enableAttention: boolean, enableBlink: boolean, enableSleep: boolean);
  }

  export enum InitializationErrorType {
    ERROR_NONE,
    ERROR_INVALID_LICENSE,
    ERROR_EXPIRED_LICENSE,
    ERROR_CAMERA_ACCESS,
    ERROR_UNKNOWN,
  }
}
