/** Kamera standar semua scene: posisi Z & FOV dipakai untuk memetakan rect DOM ke dunia 3D. */
export const CAMERA_Z = 10
export const CAMERA_FOV = 35

/** Tinggi area terlihat (unit dunia) pada bidang z = 0 untuk kamera standar. */
export const VIEW_HEIGHT = 2 * Math.tan(((CAMERA_FOV / 2) * Math.PI) / 180) * CAMERA_Z
