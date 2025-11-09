export const usePlaybackButtonConfig = () => {
  const buttons = [
    {
      id: 'short-play',
      label: '短播放',
      icon: 'fa fa-volume-up',
      classes: 'bg-shortPlay/10 text-shortPlay hover:bg-shortPlay hover:text-white',
      event: 'play-short'
    },
    {
      id: 'play-to-particle',
      label: '到助词为止',
      icon: 'fa fa-volume-up',
      classes: 'bg-particle/10 text-particle hover:bg-particle hover:text-white',
      event: 'play-to-particle'
    },
    {
      id: 'play-error-range',
      label: '从错误处播放',
      icon: 'fa fa-volume-up',
      classes: 'bg-accent/10 text-accent hover:bg-accent hover:text-white',
      event: 'play-error-range'
    }
  ]

  return {
    buttons
  }
}
