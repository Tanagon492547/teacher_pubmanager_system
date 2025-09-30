'use client'

import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { addArticle } from '@/hooks/posts/actions';
import { useRouter } from 'next/navigation';
import { cookies } from 'next/headers';
import { PrismaClient } from '@prisma/client';
import AddArticleFeature from '@/components/addArticle/AddArticleFeature';




const ArticleForm  =  () => {

  return (
    
    <AddArticleFeature  />
  )
};

export default ArticleForm;

