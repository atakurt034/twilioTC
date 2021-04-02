import Swal from 'sweetalert2'

const notification = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 1500,
  timerProgressBar: true,
  onOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  },
})

const confirm = Swal.mixin({
  title: 'Are you sure?',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!',
})

const create = Swal.mixin({
  title: 'Are you sure?',
  icon: 'question',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, create it!',
})

export const makeToast = async (type, icon, msg, data) => {
  switch (type) {
    case 'notification':
      return notification.fire({
        icon: icon,
        title: msg,
      })
    case 'delete':
      const result = await confirm.fire({
        text: `Delete ${data} you won't be able to revert this!`,
      })
      if (result.isConfirmed) {
        Swal.fire('Deleted', data, 'error')
      } else {
        Swal.fire('Cancelled', '', 'info')
      }
      return result.isConfirmed
    case 'create':
      const answer = await create.fire({
        text: `Create room ${data}`,
      })
      if (answer.isConfirmed) {
        Swal.fire('Created', data, 'success')
      } else {
        Swal.fire('Cancelled', '', 'info')
      }
      return answer.isConfirmed
    default:
      return notification.fire({
        icon: 'error',
        title: 'ERROR',
      })
  }
}
