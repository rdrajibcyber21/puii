let ioInstance = null;

export const setIoInstance = (io) => {
  ioInstance = io;
};

export const emitAlert = (alert) => {
  if (ioInstance) {
    ioInstance.emit('alert', alert);
  }
};
