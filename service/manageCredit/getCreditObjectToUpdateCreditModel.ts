type GetCreditObjProps = {
  creditObj: {
    tempCredit: number;
    nonTransferableCredit: number;
    transferableCredit: number;
  };
  credit: number;
};

export const getCreditObjectToUpdateCreditModel = ({
  creditObj,
  credit,
}: GetCreditObjProps) => {
  let remainingCredit = credit;

  const cutFromTransferableCredit = Math.min(
    remainingCredit,
    creditObj.transferableCredit
  );
  remainingCredit -= cutFromTransferableCredit;

  const cutFromNonTransferableCredit = Math.min(
    remainingCredit,
    creditObj.nonTransferableCredit
  );
  remainingCredit -= cutFromNonTransferableCredit;

  const newTransferableCredit = Math.max(
    0,
    creditObj.transferableCredit - cutFromTransferableCredit
  );

  const newNonTransferableCredit = Math.max(
    0,
    creditObj.nonTransferableCredit - cutFromNonTransferableCredit
  );

  const newTempCredit = Math.max(0, creditObj.tempCredit - remainingCredit);

  return {
    credit: {
      transferableCredit: newTransferableCredit,
      nonTransferableCredit: newNonTransferableCredit,
      tempCredit: newTempCredit,
    },
  };
};
