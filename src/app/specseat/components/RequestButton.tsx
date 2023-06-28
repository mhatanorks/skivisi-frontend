import axios from 'axios';

const RequestButton = ({
  userData,
  defaultData,
  portfolios,
  selling,
  qls,
  previousWorks,
  developmentExperiences,
  uploadFiles,
}: {
  userData: any;
  defaultData: any;
  portfolios: any;
  selling: any;
  qls: any;
  previousWorks: any;
  developmentExperiences: any;
  uploadFiles: any;
}) => {
  // データの送信  ================================================================
  const submitHandler = async (e: any) => {
    e.preventDefault();

    // 既存と新規合算
    const addRequestContents = {
      portfolios: portfolios,
      sellingPoints: selling,
      qualifications: qls,
      previousWorks: previousWorks,
      developmentExperiences: developmentExperiences,
    };

    for (const [key, value] of Object.entries(addRequestContents)) {
      if (value.length > 0) {
        defaultData[key] = [...defaultData[key], ...value];
      }
    }

    const formData = {
      userId: userData.user.userId,
      specData: defaultData.spec,
      specDetail: {
        portfolios: defaultData.portfolios,
        skillSummaries: [defaultData.skillSummaries],
        sellingPoints: defaultData.sellingPoints,
        qualifications: defaultData.qualifications,
        previousWorks: defaultData.previousWorks,
        developmentExperiences: defaultData.developmentExperiences,
      },
    };

    try {
      const response = await axios.post('/specseat/api', formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    // 画像アップロード
    // * 4, `api/upload/`に画像データpost
    const files = uploadFiles.filter((i: any) => i !== null);
    if (files && files.length > 0) {
      const data = new FormData();
      for (let i = 0; i < files.length; i++) {
        if (files[i] === null) {
          continue;
        }
        const file = files[i];
        const fileName = file.name;
        data.append('name', fileName);
        data.append('file', file);
      }

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/upload`,
          data
        );
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="text-center">
      <button
        type="submit"
        onClick={submitHandler}
        className="shadow-md mt-10 h-12  cursor-pointer bg-gradient-to-b from-orange-400 to-yellow-400 rounded-xl border-2 border-white border-solid"
      >
        <span className="text-white font-bold m-5">確認画面へ</span>
      </button>
    </div>
  );
};

export default RequestButton;
