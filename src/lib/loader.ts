/**
 * Pelacak progres preloader. Tiap tugas punya bobot; preloader membaca
 * `getLoadProgress()` setiap frame dan menganimasikan counter ke arah itu.
 */
const WEIGHTS = {
  boot: 0.1,
  fonts: 0.25,
  photo: 0.25,
  scene: 0.4,
} as const

export type LoadTask = keyof typeof WEIGHTS

const completed = new Set<LoadTask>()

export function completeTask(task: LoadTask) {
  completed.add(task)
}

export function getLoadProgress(): number {
  let progress = 0
  completed.forEach((task) => {
    progress += WEIGHTS[task]
  })
  return Math.min(1, progress)
}
