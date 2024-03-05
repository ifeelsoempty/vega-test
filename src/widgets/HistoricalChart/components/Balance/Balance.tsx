import { FC } from "react"
import { useSelector } from "react-redux"
import classNames from "classnames"

import { Portfolio } from "store/slices/portfolio/types"
import { selectTotalBalance, selectTotalBalanceDifference } from "store/slices/portfolio/selectors"
import { formatPrice } from "utils/formatePrice/formatPrice"
import { PerformanceTag } from "components/PerformanceTag"

import styles from "./Balance.module.css"

type BalanceProps = {
  portfolio: Portfolio | null,
  className?: string,
}

export const Balance: FC<BalanceProps> = ({ portfolio, className }) => {
  const totalBalance = useSelector(selectTotalBalance);
  const totalBalanceDifference = useSelector(selectTotalBalanceDifference);

  if(!portfolio) return null

  return (
    <div className={classNames(styles.root, className)}>
      <div className={styles.balance}>{formatPrice(totalBalance)}</div>
      <PerformanceTag 
        number={totalBalanceDifference.number} 
        percent={totalBalanceDifference.percent} 
      />
    </div>
  )
}
