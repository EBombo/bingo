import { Modal } from "antd";

export const useConfirm = () => (action, values, title, description) =>
  Modal.confirm({
    title: title,
    content: description,
    onOk: () => {
      action(values);
    },
    onCancel: () => null,
  });
