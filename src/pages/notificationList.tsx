import axios from 'axios';
import Header from '../components/header';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import { Request,User } from '../../types/types';

// 申請通知リスト(管理者)
const fetcher = (url: RequestInfo) =>
  fetch(url).then((res) => res.json());

const NotificationList = () => {
  // ユーザー選択
  const [selectedUserIndex, setSelectedUserIndex] = useState<
    number | null
  >(null);
  const handleUserClick = (index: number) => {
    setSelectedUserIndex(index);
  };

  // requestのデータ取得
  const { data, error } = useSWR('/api/request', fetcher);

  // dataがない場合の表示
  if (!data) {
    return (
      <>
        <Header />
        <div className="ml-24 mt-10 text-2xl text-sky-900 font-bold">
          通知はありません
        </div>
        <div className="absolute w-full" style={{ bottom: '0%' }}>
          <Footer />
        </div>
      </>
    );
  }

  // 申請結果通知の件数を計算
  const totalCount = data.filter(
    (item: Request) => item.status === 1
  ).length;

  console.log(data);

  // 職種タグカラー
  const getAffiliationColor = ({ affiliation }: any) => {
    if (affiliation === 'FR') {
      return 'bg-blue-200 text-blue-700';
    } else if (affiliation === 'PHP') {
      return 'bg-red-200 text-red-700';
    } else if (affiliation === 'JAVA') {
      return 'bg-yellow-200 text-yellow-700';
    } else if (affiliation === 'ML') {
      return 'bg-green-200 text-green-700';
    } else if (affiliation === 'QA') {
      return 'bg-purple-200 text-purple-700';
    } else if (affiliation === 'CL') {
      return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <>
      <div className="min-h-screen">
        <Header />
        <div className="ml-24 mt-10 text-2xl flex text-sky-900 font-bold">
          <div>申請通知&nbsp;&nbsp;&nbsp;</div>
          <div>{totalCount}</div>
          <div>件</div>
        </div>
        <section className="flex justify-center mt-10">
          <div id="left" className="bg-zinc-50 shadow-2xl h-[760px] overflow-y-auto">
            {data.map((request: Request, index: number) => (
              <div
                className={`flex items-center border-b border-zinc-700 py-2 cursor-pointer ${
                  selectedUserIndex === index
                    ? 'bg-blue-400 hover:bg-blue-400'
                    : 'bg-zinc-50 hover:bg-gray-200'
                }`}
                key={index}
                onClick={() => handleUserClick(index)}
              >
                <div
                  className={`font-bold text-3xl w-24 shadow-md rounded-xl text-center ml-2 py-2 ${getAffiliationColor(
                    { affiliation: request.user?.affiliation }
                  )}`}
                >
                  {request.user?.affiliation}
                </div>

                <div className="w-80 ml-6">
                  <div className="font-bold text-2xl text-sky-900 border-b border-zinc-200">
                    {request.user?.businessSituation}
                  </div>
                  <div className="font-bold text-4xl text-sky-900">
                    {request.user?.userName}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div id="right" className="bg-blue-400 shadow-2xl">
            <div
              className="bg-zinc-50 m-10 px-24 py-56"
              style={{
                boxShadow: 'inset 0 -5px 4px rgba(0, 0, 0, 0.3)',
              }}
            >
              {selectedUserIndex !== null ? (
                <p className="text-xl text-sky-900 w-80 text-center h-40">
                  {data[selectedUserIndex].engineerComment}
                </p>
              ) : (
                <p className="text-xl text-sky-900 w-80 text-center h-40">
                  ユーザーを選択してください。
                  <br />
                  リクエストコメントが表示されます。
                </p>
              )}
            </div>
            <div className="text-center pb-4 cursor-pointer">
              <Link
                legacyBehavior
                href={
                  selectedUserIndex !== null
                    ? `/approval/${data[selectedUserIndex].user?.userId}`
                    : ''
                }
              >
                <button
                  disabled={selectedUserIndex === null}
                  className={`font-bold text-2xl rounded-xl p-2 shadow-2xl ${
                    selectedUserIndex !== null
                      ? 'text-orange-50 bg-gradient-to-b from-orange-400 to-yellow-400 border-4 border-orange-50  hover:scale-110 transition-all'
                      : 'bg-gray-300 text-zinc-200 border-gray-50 border-4'
                  }`}
                >
                  確認する
                </button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    </>
  );
};

export default NotificationList;
