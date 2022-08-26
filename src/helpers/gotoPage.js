import emitter from '@/eventBus';

export default function gotoPage(pageName, pageParams) {
  emitter.emit('gotoPage', { pageName, pageParams });
}
