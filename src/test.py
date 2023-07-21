import gc
import os
import re
import sys
import time
from datetime import datetime, timedelta, timezone


import boto3
import dask.dataframe as dd
import numpy as np
import pandas as pd
from botocore.exceptions import ClientError


s3 = boto3.client("s3")


REGION = 'ap-northeast-1'
ENV = ""
# PGM = ""
# LOG_LEVEL = ""
# LOG_GROUP = ""
# START_TIME = ""
FUNC_CODE = 'FD04'
PARAM_OPERATION_DATE = "-OperationDate"
OPERATION_DATE = ""
PARAM_LOG_LEVEL = "-LogLevel"
# LOG_OUTPUT_UTIL = ""
# BUCKET_FE = "-s3-mammymart-dtk-dmpwork"
# BUCKET_TE = "-s3-mammymart-dtk-if-files"
# BUCKET_ATHENA = "-s3-mammymart-athena"


def alert_data():


try:
    # global START_TIME
    # START_TIME = time.perf_counter()

    # args = getResolvedOptions(sys.argv,['JOB_NAME'])
args = {
    'JOB_NAME': "stg-gl-FD04_alert_data_inventory"
}
global PGM
PGM = args['JOB_NAME']


# 実行環境名の取得
global ENV
ENV = re.match('^(stg|p)', args['JOB_NAME']).group()


# global BUCKET
# BUCKET = 's3://'+ ENV + BUCKET_TE


# global BUCKET_DATACK
# BUCKET_DATACK = 's3://'+ ENV + BUCKET_FE


# 開始処理
StartProcess()
operation_date_dt = datetime.strptime(OPERATION_DATE, '%Y%m%d')
previous_date = operation_date_dt
f_previous_date_dt = previous_date.strftime('%Y%m%d')
print(OPERATION_DATE, f_previous_date_dt)
files_size = {
    "szaiko_yesterday_csv": 1,
    "szaiko_today_csv": 1
}


# read dmp_szaiko_yesterday
szaiko_yesterday_use_cols = [0, 1]
szaiko_yesterday_int_cols = []
szaiko_yesterday_col_name = ["store_code", "product_code"]
szaiko_yesterday_col_type = {"store_code": 'str', "product_code": "str"}


if files_size["szaiko_yesterday_csv"] is not None and files_size["szaiko_yesterday_csv"] != 0:
    # in_file_path = BUCKET + '/' + SZAIKO_YESTERDAY + '_' + str(f_operation_date_dt) + '.csv'
in_file_path = f'/home/ubuntu/Documents/test/DMP_SZAIKO_test/test1/DMP_SZAIKO_{f_previous_date_dt}.csv'
df_szaiko_yesterday_mst = ReadFile(files_size["szaiko_yesterday_csv"], in_file_path, szaiko_yesterday_use_cols,
                                   szaiko_yesterday_col_name, szaiko_yesterday_col_type, szaiko_yesterday_int_cols)
if len(df_szaiko_yesterday_mst) > 0:
if len(df_szaiko_yesterday_mst) > 0:
print("read szaiko_yesterday succesful!!")
else:
df_szaiko_yesterday_mst = CreateDF(
    szaiko_yesterday_col_name, szaiko_yesterday_col_type)
del szaiko_yesterday_use_cols, szaiko_yesterday_int_cols, szaiko_yesterday_col_name, szaiko_yesterday_col_type


# read dmp_szaiko_today
szaiko_today_use_cols = [0, 1]
szaiko_today_int_cols = []
szaiko_today_col_name = ["store_code", "product_code"]
szaiko_today_col_type = {"store_code": 'str', "product_code": "str"}


if files_size["szaiko_today_csv"] is not None and files_size["szaiko_today_csv"] != 0:
    # in_file_path = BUCKET + '/' + szaiko_today + '_' + str(f_operation_date_dt) + '.csv'
in_file_path = f'/home/ubuntu/Documents/test/DMP_SZAIKO_test/test1/DMP_SZAIKO_{OPERATION_DATE}.csv'
df_szaiko_today_mst = ReadFile(files_size["szaiko_today_csv"], in_file_path, szaiko_today_use_cols,
                               szaiko_today_col_name, szaiko_today_col_type, szaiko_today_int_cols)
if len(df_szaiko_today_mst) > 0:
if len(df_szaiko_today_mst) > 0:
print("read szaiko_today succesful!!")
else:
df_szaiko_today_mst = CreateDF(szaiko_today_col_name, szaiko_today_col_type)
del szaiko_today_use_cols, szaiko_today_int_cols, szaiko_today_col_name, szaiko_today_col_type


# get record by store code
df_szaiko_yesterday_mst = df_szaiko_yesterday_mst.groupby(
    'store_code').count().reset_index()
df_szaiko_today_mst = df_szaiko_today_mst.groupby(
    'store_code').count().reset_index()


# compare record data yesterday and today


for i in range(len(df_szaiko_today_mst)):
value_yesterday = df_szaiko_yesterday_mst.iloc[i, 1]
value_today = df_szaiko_today_mst.iloc[i, 1]
result = value_today/value_yesterday*100
if result <= 80:
print(f'Store {df_szaiko_today_mst.iloc[i, 0]}: Cảnh báo {result}%')
except Exception as e:
print(str(e))


def ReadFile(file_size, file_path, use_cols, cols_name, cols_type, int_cols):


try:
    # file_name = os.path.splitext(os.path.basename(file_path))[0]
if file_size is not None:
if file_size > 0:
df = dd.read_csv(file_path, header=None, usecols=use_cols,
                 names=cols_name, dtype="str", encoding="UTF-8", engine="python")
df = df.compute()
# 数値型項目が存在する場合
# if int_cols is not None:
# if "バラ入数" in int_cols:
# df[int_cols] = df[int_cols].fillna(999999)
# else:
# df[int_cols] = df[int_cols].fillna(0)
if len(cols_name) > 1:
df.fillna('', inplace=True)
df = df.astype(cols_type)
else:
df = pd.DataFrame(columns=cols_name)
df = df.astype(cols_type)
except Exception as e:
print(str(e))
else:
return df


def CreateDF(cols_name, cols_type):


try:
df = pd.DataFrame(columns=cols_name)
df = df.astype(dtype=cols_type)
except Exception as e:
print(str(e))
else:
return df


def StartProcess():


try:
    # LogOutputUtilインスタンス生成
    # global LOG_LEVEL
    # global LOG_OUTPUT_UTIL
    # LOG_OUTPUT_UTIL = LogOutputUtil.LogOutputUtil(LOG_LEVEL)

    # パラメータストア読込処理
    # パラメータストアキー：ログレベル
