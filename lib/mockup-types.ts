export interface Device {
  id: string;
  title: string;
  description: string | null;
  model_url: string;
  meta_url?: string | null;
  default_background?: string | null;
  default_scale?: number | null;
  screen_mesh_name?: string | null;
  screen_material_name?: string | null;
  screen_parent_name?: string | null;
  screen_rotation_deg?: number | null;
  screen_orientation?: "horizontal" | "vertical" | null;
  screen_fit_mode?: "cover" | "contain" | "stretch" | null;
  screen_aspect?: number | null;
  screen_mirror_x?: boolean | null;
  y_offset?: number | null;
  recommended_resolution?: string | null;
  thumbnail_url?: string | null;
}

export interface MockupAnimations {
  followCursor?: boolean;
  followCursorSpeed?: number; // 0..1 — lerp rate mapped to 1..9
  followCursorRotation?: number; // 0..1 — max radians the camera can swing
  followCursorInvert?: boolean; // flips the vertical (pitch) response
  grabMove?: boolean; // drag pans (moves) the device instead of orbiting
  followCursorSensitivity?: number; // legacy single-knob, applied to both
  autoRotate?: boolean;
  autoRotateSensitivity?: number; // 0..1 — mapped to 0.4 + s*6 speed
  scrollMove?: boolean;
  loopAnimation?: boolean;
  loopAnimationSensitivity?: number; // 0..1 — mapped to 0..0.2 target.y amplitude
  scrollZoom?: boolean; // default true — mouse wheel drives OrbitControls zoom
  deviceColor?: string; // hex, applied to phone-body materials ('' = factory)
  deviceColors?: Record<string, string>; // per-zone tints keyed by original hex
  deviceFinish?: string; // '' | 'mat' | 'metal' | 'glossy'
  imageZoom?: number; // 1 = 100%
  lightPosition?: number; // 0..1 → 0-360° around the device
  screenExposure?: number; // 0..1 — screen texture brightness
  showShadow?: boolean; // drop shadow under the device (plugin-side)
}

export interface Mockup {
  id: string;
  user_id: string;
  device_id: string;
  name: string;
  media_type: "image" | "video" | "none";
  screen_image_url?: string | null;
  screen_video_url?: string | null;
  environment_id?: string | null;
  environment_offset?: number | null;
  light_intensity?: number | null;
  camera_position?: string | null;
  camera_position_x?: number | null;
  camera_position_y?: number | null;
  camera_position_z?: number | null;
  camera_rotation_x?: number | null;
  camera_rotation_y?: number | null;
  camera_rotation_z?: number | null;
  is_locked?: boolean | null;
  animations?: MockupAnimations | null;
}

export interface Profile {
  id: string;
  subscription_status: "active" | "trialing" | "past_due" | "canceled" | "incomplete" | "none";
  plan: string;
}

