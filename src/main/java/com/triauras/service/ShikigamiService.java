package com.triauras.service;

import com.triauras.entity.Shikigami;

import java.util.List;

public interface ShikigamiService {
   int fetchAndSaveShikigamiList();
   int findShikigamiById(int shikigamiId);
   List<Shikigami> findAllShikigami();

   String downloadAndUploadImageById(String imgUrl, String head_name, String bucketName,String rarity);
}