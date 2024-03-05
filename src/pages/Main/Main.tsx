
import { FC, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DatePicker, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { BalanceDonutChart } from 'widgets/BalanceDonutChart';
import { HistoricalChart } from 'widgets/HistoricalChart';
import { AppDispatch } from 'store';
import { getAssets, getPortfolio, getStartDatePortfolio, setHistoricalDate } from 'store/slices/portfolio';
import { selectAssets, selectHistoricalDate, selectPortfolio, selectStartDatePortfolio } from 'store/slices/portfolio/selectors';
import { FIRST_AVAILABLE_DATE, LAST_AVAILABLE_DATE } from 'api/mocks/data';

import styles from './Main.module.css'

const DATE_FORMAT = 'YYYY-MM-DD'

const isDisabledDate = (date: Dayjs) => {
  return date > dayjs(LAST_AVAILABLE_DATE) || date <= dayjs(FIRST_AVAILABLE_DATE)
}

export const Main: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isAssetsLoading, requested: assetsRequested, error: assetsError } = useSelector(selectAssets);
  const { isLoading: isPortfolioLoading, requested: portfolioRequested, error: portfolioError } = useSelector(selectPortfolio);
  const { isLoading: isStartDatePortfolioLoading, error: startDatePortfolioError } = useSelector(selectStartDatePortfolio);
  const historicalDate = useSelector(selectHistoricalDate);

  const isPortfolioUpdating = isPortfolioLoading && portfolioRequested
  const isPortfolioFirstLoading = isPortfolioLoading && !portfolioRequested;
  const isLoading = isAssetsLoading || isPortfolioFirstLoading || isStartDatePortfolioLoading
  const error = assetsError || portfolioError || startDatePortfolioError;

  useEffect(() => {
    if (!assetsRequested) {
      dispatch(getAssets());
    }
  }, [dispatch, assetsRequested]);

  useEffect(() => {
    if(!isAssetsLoading && assetsRequested) {
      dispatch(getStartDatePortfolio())
    }
  }, [dispatch, isAssetsLoading, assetsRequested]);

  useEffect(() => {
    if(!isAssetsLoading && assetsRequested) {
      dispatch(getPortfolio())
    }
  }, [dispatch, isAssetsLoading, assetsRequested, historicalDate])

  const handleDateChange = (value: Dayjs) => {
    dispatch(setHistoricalDate(value.format(DATE_FORMAT)));
  }

  return (
    <div className={styles.root}>
      {!error && (
        <>
          <div className={styles.header}>
            <DatePicker 
              disabled={isLoading || isPortfolioUpdating} 
              allowClear={false} 
              disabledDate={isDisabledDate} 
              value={dayjs(historicalDate)} 
              onChange={handleDateChange} />
              {isPortfolioUpdating && <Spin size='large' 
            />}
          </div>
          <div className={styles.charts}>
            {!isLoading && (
              <>
                <BalanceDonutChart />
                <HistoricalChart />
              </>
            )}
            {isLoading && <Spin size='large' />}
          </div>
        </>
      )}
    </div>
  );
}
